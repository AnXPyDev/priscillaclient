#include <stdio.h>
#include <malloc.h>
#include <pthread.h>

#include <Windows.h>
#include <Winuser.h>

int RUNNING = 1;
HWND clientWindowHandle = NULL;

#include "decl.c"
#include "message.c"
#include "feature.c"
#include "job.c"
#include "command.c"

static void handler(int sig) {
    switch (sig) {
        case SIGTERM:
        case SIGINT:
        case SIGABRT:
            RUNNING = 0;
            break;
    }
}

Job jobs[MAX_JOBS];

void handle_start_job(FILE *in, MessageOutputStream *out) {
    Size id;
    fread(&id, sizeof(Size), 1, in);
    jobs[id] = Job_read(in, out);
    Job_launch(&jobs[id]);
}

void handle_command(FILE *in, MessageOutputStream *out) {
    Command_read_and_run(in, out);
}

void handle_stop_job(FILE *in) {
    Size id;
    fread(&id, sizeof(Size), 1, in);
    jobs[id].running = 0;
}


int main() {
    FILE *in = stdin;
    MessageOutputStream out;
    out.file = stdout;
    pthread_mutex_init(&out.mutex, NULL);

    while (RUNNING) {
        RequestCode rcode;
        fread(&rcode, sizeof(RequestCode), 1, in);
        switch (rcode) {
            case REQUEST_JOB_START:
                handle_start_job(in, &out);
                break;
            case REQUEST_JOB_STOP:
                handle_stop_job(in);
                break;
            case REQUEST_COMMAND:
                handle_command(in, &out);
                break;
            case REQUEST_SERVICE_STOP:
                RUNNING = 0;
                break;
            default:
                fprintf(stderr, "Invalid request code %d, aborting\n", rcode);
                break;
        }
    }

    pthread_exit(0);
}

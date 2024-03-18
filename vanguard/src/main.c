#include <stdio.h>
#include <signal.h>
#include <pthread.h>
#include <Windows.h>
#include <winuser.h>
#include <malloc.h>

int RUNNING = 1;

static void handler(int sig) {
    switch (sig) {
        case SIGTERM:
        case SIGINT:
        case SIGABRT:
            RUNNING = 0;
            break;
    }
}

enum EFeatures {
    FEATURE_FOREGROUND_WINDOW = 0,
    FEATURE__END
};

typedef struct {
    pthread_mutex_t mutex;
    FILE *fp;
} MessageOutputStream;

typedef void (*feature_fn)(MessageOutputStream *stream, void *payload);


struct FeatureThreadOptions {
    MessageOutputStream *stream;
    feature_fn feature;
    int sleep;
    void *payload;
};

void *run_feature_thread(void *payload) {
    struct FeatureThreadOptions options = *(struct FeatureThreadOptions*)payload;

    while (RUNNING) {
        options.feature(options.stream, options.payload);
        Sleep(options.sleep);
    }

    return NULL;
}
void launch_feature_thread(pthread_t *thread, struct FeatureThreadOptions *options) {
    pthread_create(thread, NULL, &run_feature_thread, options);
}

struct M_foreground_window {
    HWND handle;
};

enum EMessages {
    MESSAGE_FOREGROUND_WINDOW
};

void foreground_window(MessageOutputStream *stream, void *payload) {
    enum EMessages mcode = MESSAGE_FOREGROUND_WINDOW;
    struct M_foreground_window message;
    message.handle = GetForegroundWindow(); 

    pthread_mutex_lock(&stream->mutex);
    fwrite(&mcode, sizeof(enum EMessages), 1, stream->fp);
    fwrite(&message, sizeof(struct M_foreground_window), 1, stream->fp);
    fflush(stream->fp);
    pthread_mutex_unlock(&stream->mutex);
}

int main() {
    MessageOutputStream stream;
    stream.fp = stdout;
    pthread_mutex_init(&stream.mutex, NULL);

    pthread_t fw_thread;

    struct FeatureThreadOptions fw_options;
    fw_options.feature = &foreground_window;
    fw_options.payload = NULL;
    fw_options.sleep = 100;
    fw_options.stream = &stream;

    launch_feature_thread(&fw_thread, &fw_options);
    pthread_join(fw_thread, NULL);

    return 0;
}
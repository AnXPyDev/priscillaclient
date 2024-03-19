typedef struct {
    Feature *feature;
    MessageOutputStream *stream;
    int repeat;
    int delay;
    void *payload;
} Job;

void *Job_entry(Job *this) {
    if (!this->repeat) {
        this->feature->function(this->stream, this->payload);
        goto quit;
    }

    int c = 0;

    while (RUNNING && !c) {
        c = this->feature->function(this->stream, this->payload);
        Sleep(this->delay);
    }

    quit:;
    free(this->payload);
    return NULL;
}

void Job_launch(Job *this, pthread_t *thread) {
    pthread_create(thread, NULL, (void*)&Job_entry, this);
}
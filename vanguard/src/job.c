typedef struct {
    const Feature *feature;
    MessageOutputStream *stream;
    int delay;
    void *payload;
    int running;
    pthread_t thread;
} Job;

void *Job_entry(Job *this) {
    if (!this->delay) {
        this->feature->function(this->stream, this->payload);
        goto quit;
    }

    int c = 0;

    while (RUNNING && this->running && !c) {
        c = this->feature->function(this->stream, this->payload);
        Sleep(this->delay);
    }

    quit:;
    return NULL;
}

void Job_launch(Job *this) {
    this->running = 1;
    pthread_create(&this->thread, NULL, (void*)&Job_entry, this);
}

Job Job_read(FILE *file, MessageOutputStream *stream) {
    Job this;
    this.stream = stream;
    this.running = 0;

    FeatureCode fcode;
    fread(&fcode, sizeof(FeatureCode), 1, file);
    this.feature = features[fcode];

    fread(&this.delay, sizeof(int), 1, file);

    Size payload_size;
    fread(&payload_size, sizeof(Size), 1, file);

    if (payload_size == 0) {
        this.payload = NULL;
        goto quit;
    }

    this.payload = malloc(payload_size);
    fread(this.payload, payload_size, 1, file);

    quit:;
    return this;
}
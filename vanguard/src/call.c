typedef struct {
    FeatureCode code;
    int delay;
    Size payload_size;
    void *payload;
} Call;

Call Call_read(FILE *file) {
    Call this;
    fread(&this.code, sizeof(FeatureCode), 1, file);
    fread(&this.delay, sizeof(int), 1, file);
    fread(&this.payload_size, sizeof(Size), 1, file);

    if (this.payload_size == 0) {
        this.payload = NULL;
        goto quit;
    }

    this.payload = malloc(this.payload_size);
    fread(this.payload, this.payload_size, 1, file);

    quit:;
    return this;
}

Job Call_create_job() {

}
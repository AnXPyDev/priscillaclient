void Command_read_and_run(FILE *file, MessageOutputStream *stream) {
    FeatureCode fcode;
    fread(&fcode, sizeof(FeatureCode), 1, file);
    const Feature *feature = features[fcode];

    Size payload_size;
    fread(&payload_size, sizeof(Size), 1, file);

    void *payload;

    if (payload_size == 0) {
        payload = NULL;
        goto quit;
    }

    payload = malloc(payload_size);
    fread(payload, payload_size, 1, file);

    quit:;

    feature->function(stream, payload);
}
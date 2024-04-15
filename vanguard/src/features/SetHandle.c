int feature_setHandle(MessageOutputStream *stream, void *payload) {
    HWND handle = *(void**)payload;
    fprintf(stderr, "handle: %p", handle); fflush(stderr);
}

const Feature FSetHandle = { &feature_setHandle };
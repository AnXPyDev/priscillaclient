int feature_setHandle(MessageOutputStream *stream, void *payload) {
    windowHandle = *(HWND*)payload;
    fprintf(stderr, "handle set: %p", windowHandle); fflush(stderr);
}

const Feature FSetHandle = { &feature_setHandle };
int feature_setHandle(MessageOutputStream *stream, void *payload) {
    clientWindowHandle = *(HWND*)payload;
    fprintf(stderr, "handle set: %p", clientWindowHandle); fflush(stderr);
}

const Feature FSetHandle = {
    &empty_init_fn,
    &feature_setHandle,
    &empty_cleanup_fn
};
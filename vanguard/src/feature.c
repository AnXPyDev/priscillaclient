typedef void *(*feature_init_fn)(MessageOutputStream *stream, void *payload);
typedef int (*feature_body_fn)(MessageOutputStream *stream, void *payload);
typedef int (*feature_cleanup_fn)(MessageOutputStream *stream, void *payload);

void *empty_init_fn(MessageOutputStream *stream, void *payload) {
    return payload;
}

int empty_cleanup_fn(MessageOutputStream *stream, void *payload) {
    return 0;
}

typedef struct {
    feature_init_fn init;
    feature_body_fn body;
    feature_cleanup_fn cleanup;
} Feature;

#include "features/WatchForegroundWindow.c"
#include "features/SetHandle.c"

const Feature *features[FEATURE__END] = {
    &FSetHandle,
    &FWatchForegroundWindow
};
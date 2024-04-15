typedef int (*feature_fn)(MessageOutputStream *stream, void *payload);

typedef struct {
    feature_fn function;
} Feature;

#include "features/GetForegroundWindow.c"
#include "features/SetHandle.c"

const Feature *features[FEATURE__END] = {
    &FSetHandle,
    &FGetForegroundWindow
};
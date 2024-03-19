typedef int (*feature_fn)(MessageOutputStream *stream, void *payload);

typedef struct {
    feature_fn function;
} Feature;

#include "features/GetForegroundWindow.c"

const Feature *features[FEATURE__END] = {
    &FGetForegroundWindow
};
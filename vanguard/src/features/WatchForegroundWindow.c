
struct state_WFGW {
    HWND last_handle;
};

void *feature_WFGW_init(MessageOutputStream *stream, void *payload) {
    struct state_WFGW *state = malloc(sizeof(struct state_WFGW));
    state->last_handle = clientWindowHandle;
    return state;
}

int *feature_WFGW_cleanup(MessageOutputStream *stream, struct state_WFGW *state) {
    free(state);
    return 0;
}

int feature_WFGW_body(MessageOutputStream *stream, struct state_WFGW *state) {
    HWND handle = GetForegroundWindow();

    if (state->last_handle == handle) {
        goto quit;
    }

    if (handle == clientWindowHandle) {
        Message msg;
        msg.code = MESSAGE_CLIENT_FOREGROUND_WINDOW;
        msg.size = 0;
        MessageOutputStream_write(stream, &msg);
    } else if (IsChild(clientWindowHandle, handle)) {
        Message msg;
        msg.code = MESSAGE_CHILD_FOREGROUND_WINDOW;
        msg.size = 0;
        MessageOutputStream_write(stream, &msg);
    } else {
        struct {
            HWND handle;
            char title[128];
        } msg_body;

        msg_body.handle = handle;
        int title_length = GetWindowTextA(handle, msg_body.title, 128);

        Message msg;
        msg.code = MESSAGE_WRONG_FOREGROUND_WINDOW;
        msg.size = sizeof(msg_body.handle) + title_length;
        msg.data = &msg_body;
        MessageOutputStream_write(stream, &msg);
    }
    
    state->last_handle = handle;

    quit:;
    return 0;
}

const Feature FWatchForegroundWindow = {
    (feature_init_fn)&feature_WFGW_init,
    (feature_body_fn)&feature_WFGW_body,
    (feature_cleanup_fn)&feature_WFGW_cleanup
};
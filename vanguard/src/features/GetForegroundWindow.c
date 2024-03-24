int feature_getForegroundWindow(MessageOutputStream *stream, void *payload) {
    HWND handle = GetForegroundWindow();
    Message msg;
    msg.code = MESSAGE_GET_FOREGROUND_WINDOW;
    msg.size = sizeof(handle);
    msg.data = &handle;
    MessageOutputStream_write(stream, &msg);
    return 0;
}

const Feature FGetForegroundWindow = { &feature_getForegroundWindow };
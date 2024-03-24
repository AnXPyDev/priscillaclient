
typedef struct {
    MessageCode code;
    Size size;
    void *data;
} Message;

typedef struct {
    pthread_mutex_t mutex;
    FILE *file;
} MessageOutputStream;

void MessageOutputStream_lock(MessageOutputStream *this) {
    pthread_mutex_lock(&this->mutex);
}

void MessageOutputStream_unlock(MessageOutputStream *this) {
    pthread_mutex_unlock(&this->mutex);
}

void MessageOutputStream_write(MessageOutputStream *this, Message *message) {
    MessageOutputStream_lock(this);
    fwrite(&message->code, sizeof(MessageCode), 1, this->file);
    fwrite(&message->size, sizeof(Size), 1, this->file);
    fwrite(message->data, message->size, 1, this->file);
    fflush(this->file);
    MessageOutputStream_unlock(this);
}
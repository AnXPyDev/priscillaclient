typedef unsigned int Size;

typedef enum {
    FEATURE_SET_HANDLE = 0,
    FEATURE_GET_FOREGROUND_WINDOW,
    FEATURE__END
} FeatureCode;

typedef enum {
    MESSAGE_GET_FOREGROUND_WINDOW = 0,
    MESSAGE__END
} MessageCode;

typedef enum {
    REQUEST_JOB_START = 0,
    REQUEST_JOB_STOP,
    REQUEST_COMMAND,
    REQUEST_SERVICE_STOP,
    REQUEST__END
} RequestCode;

/*
REQUEST_JOB_START:
rcode: int LE 4
job_id: uint LE 4
fcode: int LE 4
delay: int LE 4
payload_size: uint LE 4
payload: any [payload_size]
*/

/*
REQUEST_COMMAND
rcode: int LE 4
fcode: int LE 4
payload_size uint LE 4
payload any [payload_size]
*/

/*
REQUEST_JOB_STOP:
rcode: int LE 4
job_id: uint LE 4
*/

/*
REQUEST_SET_WINDOW_HANDLE
rcode int LE 4

*/

#define MAX_JOBS 256
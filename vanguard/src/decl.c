typedef unsigned int Size;

typedef enum {
    FEATURE_GET_FOREGROUND_WINDOW = 0,
    FEATURE__END
} FeatureCode;

typedef enum {
    MESSAGE_GET_FOREGROUND_WINDOW = 0,
    MESSAGE__END
} MessageCode;

typedef enum {
    REQUEST_JOB_START = 0,
    REQUEST_JOB_STOP,
    REQUEST_SERVICE_STOP,
    REQUEST__END
} RequestCode;

/*
REQUEST_JOB:
rcode: int LE 4
job_id: uint LE 4
fcode: int LE 4
delay: int LE 4
payload_size: uint LE 4
payload: any [payload_size]
*/

#define MAX_JOBS 256
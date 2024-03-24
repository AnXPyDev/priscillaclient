export const MAX_JOBS = 256;

export enum RequestCode {
    REQUEST_JOB_START = 0,
    REQUEST_JOB_STOP,
    REQUEST_SERVICE_STOP
};

export enum FeatureCode {
    FEATURE_GET_FOREGROUND_WINDOW = 0
}

export enum MessageCode {
    MESSAGE_GET_FOREGROUND_WINDOW = 0
}

export class VanguardRequest {
    code: RequestCode;

    constructor(code: RequestCode) {
        this.code = code;
    }

    toBuffer(): Buffer {
        const header = Buffer.alloc(4);
        header.writeInt32LE(this.code, 0);

        const details = this.detailsToBuffer();
        if (!details) {
            return header;
        }

        return Buffer.concat([header, details]);
    }

    detailsToBuffer(): Buffer | undefined {
        return undefined;
    }
}

export class VanguardRequestJobStart extends VanguardRequest {
    job_id: number;
    feature_code: FeatureCode;
    delay: number;
    payload?: Buffer;

    constructor(job_id: number, feature_code: FeatureCode, delay: number, payload?: Buffer) {
        super(RequestCode.REQUEST_JOB_START);
        this.job_id = job_id;
        this.feature_code = feature_code;
        this.delay = delay;
        this.payload = payload;
    }

    override detailsToBuffer(): Buffer {
        const header = Buffer.alloc(4 + 4 + 4 + 4);

        header.writeUint32LE(this.job_id, 0);
        header.writeInt32LE(this.feature_code, 4);
        header.writeInt32LE(this.delay, 8);
        if (!this.payload) {
            header.writeUint32LE(0, 12);
            return header;
        }

        header.writeUint32LE(this.payload.length, 12);
        return Buffer.concat([header, this.payload])
    }
}

export class VanguardRequestJobStop extends VanguardRequest {
    job_id: number;

    constructor(job_id: number) {
        super(RequestCode.REQUEST_JOB_STOP);
        this.job_id = job_id;
    }

    override detailsToBuffer(): Buffer {
        const buffer = Buffer.alloc(4);
        buffer.writeUint32LE(this.job_id, 0);
        return buffer;
    }
}

export class VanguardMessage {
    code: MessageCode;
    message?: Buffer; 
    
    static take(messages: Buffer): { unread: Buffer, message: VanguardMessage } {
        let blen = messages.length;

        if (blen < 8) {
            throw new Error("VanguardMessage: cannot take because buffer is less than 8 bytes");
        }

        const code = messages.readInt32LE(0);
        if (!(code in MessageCode)) {
            throw new Error(`VanguardMessage: invalid code ${code}`);
        }

        const size = messages.readUint32LE(4);
        blen -= 8;

        if (blen < size) {
            throw new Error("VanguardMessage: cannot take because mismatch in buffer length and message size");
        }

        let data: Buffer | undefined;

        if (size != 0) {
            data = messages.subarray(8, 8 + size);
        }

        return {
            unread: messages.subarray(8 + size),
            message: new VanguardMessage(code, data)
        }
    }

    constructor(code: MessageCode, message?: Buffer) {
        this.code = code;
        this.message = message; 
    }

}
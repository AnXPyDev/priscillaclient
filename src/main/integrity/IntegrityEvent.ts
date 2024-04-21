import IntegrityModule from "./IntegrityModule";

export enum Severity {
    SPECIAL_INFO = -1, INFO, WARNING, SEVERE, BREACH
};

export default class IntegrityEvent {
    module: string;
    timestamp: Date;
    severity: Severity;
    message: string;
    data: object;

    constructor(module: string, timestamp: Date, severity: Severity, message: string, data: object = {}) {
        this.message = message;
        this.module = module;
        this.severity = severity;
        this.timestamp = timestamp;
        this.data = data;
    }

    toString(): string {
        return `IntegrityEvent: ${this.module} ${this.timestamp.toISOString()} ${Severity[this.severity]} "${this.message}" ${JSON.stringify(this.data)}`;
    }

    static create(origin: string, severity: Severity, message: string, data?: object) {
        return new IntegrityEvent(origin, new Date(Date.now()), severity, message, data);
    }

};
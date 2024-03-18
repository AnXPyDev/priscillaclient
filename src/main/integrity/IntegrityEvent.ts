export enum Severity {
    INFO, WARNING, SEVERE, BREACH
};

export default class IntegrityEvent {
    module: string;
    timestamp: Date;
    severity: Severity;
    message: string;

    constructor(module: string, timestamp: Date, severity: Severity, message: string) {
        this.message = message;
        this.module = module;
        this.severity = severity;
        this.timestamp = timestamp;
    }

    toString(): string {
        return `IntegrityEvent: ${this.module} ${this.timestamp.toISOString()} ${Severity[this.severity]} "${this.message}"`;
    }

};
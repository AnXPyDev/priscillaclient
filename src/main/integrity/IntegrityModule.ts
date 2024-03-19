import IntegrityEvent, { Severity } from "./IntegrityEvent";
import IntegrityManager from "./IntegrityManager";

export default abstract class IntegrityModule {
    manager!: IntegrityManager;

    abstract getName(): string;

    abstract start(): void;
    abstract stop(): void;

    attach(manager: IntegrityManager) {
        this.manager = manager;
    }

    submitEvent(severity: Severity, message: string) {
        this.manager.submitEvent(new IntegrityEvent(this.getName(), new Date(Date.now()), severity, message));
    }
};
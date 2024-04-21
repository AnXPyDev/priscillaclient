import IntegrityEvent, { Severity } from "./IntegrityEvent";
import IntegrityManager from "./IntegrityManager";

export abstract class IntegrityModuleFactory {
    abstract create(): IntegrityModule
}

export default abstract class IntegrityModule {
    manager!: IntegrityManager;

    abstract getName(): string;

    abstract start(): void;
    abstract stop(): void;

    attach(manager: IntegrityManager) {
        this.manager = manager;
    }

    submitEvent(severity: Severity, message: string, data: object = {}) {
        this.manager.submitEvent(IntegrityEvent.create(this.getName(), severity, message, data));
    }

    configure(options?: object): void {}
};
import IntegrityEvent, { Severity } from "@/integrity/IntegrityEvent";
import IntegrityModule, { IntegrityModuleFactory } from "@/integrity/IntegrityModule";
import PushService from "@/remote/PushService";

export class SupervisorFactory extends IntegrityModuleFactory {
    create(): IntegrityModule {
        return new Supervisor();
    }
}

interface SupervisorConfiguration {
    minimum_severity?: number
    minimum_lock_severity?: number
    minimum_warning_severity?: number
    locking_active?: boolean
}

export default class Supervisor extends IntegrityModule {
    pushservice!: PushService;
    minimum_severity: number = -255;
    minimum_lock_severity: number = Severity.BREACH;
    minimum_warning_severity: number = Severity.WARNING;
    locking_active: boolean = true

    getName(): string {
        return "Supervisor";
    }

    start(): void {
        this.manager.emitter.on("IE", (event: IntegrityEvent) => {
            if (event.severity >= this.minimum_severity || event.severity < 0) {
                this.pushservice.pushEvent(event);
            }
            if (event.severity >= this.minimum_lock_severity && this.locking_active) {
                if (this.manager.client.state.state.locked) {
                    return;
                }
                this.manager.client.state.lock();
                this.submitEvent(Severity.SPECIAL_INFO, "Client session locked", {
                    reason: "Previous event"
                });
            }
            if (event.severity >= this.minimum_warning_severity) {
                if (this.manager.client.state.state.warning) {
                    return;
                }
                this.manager.client.state.setWarning();
                this.submitEvent(Severity.SPECIAL_INFO, "Warning set", {
                    reason: "Previous event"
                });
            }
        });
    }

    stop(): void {}

    configure(options: SupervisorConfiguration = {}): void {
        const server = this.manager.client.server;
        this.pushservice = server.pushservice;

        this.locking_active = options.locking_active ?? this.locking_active;
        
        this.manager.emitter.on("Supervisor-enableLocking", () => {
            this.locking_active = true;
        });
        
        this.manager.emitter.on("Supervisor-disableLocking", () => {
            this.locking_active = false;
        });

        this.minimum_severity = options.minimum_severity ?? this.minimum_severity;
        this.minimum_lock_severity = options.minimum_lock_severity ?? this.minimum_lock_severity;
        this.minimum_warning_severity = options.minimum_warning_severity ?? this.minimum_warning_severity;
    }
}

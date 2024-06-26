import IntegrityEvent, { Severity } from "@/integrity/IntegrityEvent";
import IntegrityModule, { IntegrityModuleFactory } from "@/integrity/IntegrityModule";
import Server from "@/remote/Server";


export class SupervisorFactory extends IntegrityModuleFactory {
    create(): IntegrityModule {
        return new Supervisor();
    }
}

abstract class Connection {
    abstract connect(): Promise<any>;
    abstract disconnect(): Promise<any>;
    abstract push(event: IntegrityEvent): Promise<any>;
}

class HttpConnection extends Connection {
    server: Server;

    constructor(server: Server) {
        super();
        this.server = server;
    }

    async connect() {}
    async disconnect() {}
    async push(event: IntegrityEvent) {
        await this.server.post("/client/pushevent", {
            "data": JSON.stringify(event)
        });
    }
}

class LogConnection extends Connection {
    async connect() {}
    async disconnect() {}
    async push(event: IntegrityEvent) {
        console.log(event.toString());
    }
}

interface SupervisorConfiguration {
    protocol?: string
    minimum_severity?: number
    minimum_lock_severity?: number
    minimum_warning_severity?: number
    locking_active?: boolean
}

export default class Supervisor extends IntegrityModule {
    connection!: Connection;
    minimum_severity: number = -255;
    minimum_lock_severity: number = Severity.BREACH;
    minimum_warning_severity: number = Severity.WARNING;
    locking_active: boolean = true

    getName(): string {
        return "Supervisor";
    }

    start(): void {
        this.connection.connect();

        this.manager.emitter.on("IE", (event: IntegrityEvent) => {
            if (event.severity >= this.minimum_severity || event.severity < 0) {
                this.connection.push(event);
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

    stop(): void {
       this.connection.disconnect();
    }

    configure(options: SupervisorConfiguration = {}): void {
        const server = this.manager.client.server;
        const protocol: string = options.protocol ?? server.features?.supervisor?.protocol ?? "log";

        this.locking_active = options.locking_active ?? this.locking_active;
        
        this.manager.emitter.on("Supervisor-enableLocking", () => {
            this.locking_active = true;
        });
        
        this.manager.emitter.on("Supervisor-disableLocking", () => {
            this.locking_active = false;
        });

        if (protocol == 'http') {
            this.connection = new HttpConnection(server);
        } else {
            if (protocol != "log") {
                console.error(`Invalid supervisor protocol "${protocol}", using log`);
            }
            this.connection = new LogConnection();
        } 


        this.minimum_severity = options.minimum_severity ?? this.minimum_severity;
        this.minimum_lock_severity = options.minimum_lock_severity ?? this.minimum_lock_severity;
        this.minimum_warning_severity = options.minimum_warning_severity ?? this.minimum_warning_severity;
    }
}
import assert from "assert";
import IntegrityEvent, { Severity } from "../../IntegrityEvent";
import IntegrityModule, { IntegrityModuleFactory } from "../../IntegrityModule";
import { Socket, io as connectSocket, io } from 'socket.io-client';
import Server from "@/main/Server";
import { Axios } from "axios";


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
        await this.server.post("/client/supervisor/pushevent", {
            "data": event
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
}

export default class Supervisor extends IntegrityModule {
    socket?: Socket;
    connection!: Connection;
    minimum_severity: number = -255;
    minimum_lock_severity: number = Severity.BREACH;

    getName(): string {
        return "Supervisor";
    }

    start(): void {

        this.connection.connect();

        this.manager.emitter.on("IE", (event: IntegrityEvent) => {
            if (event.severity >= this.minimum_severity || event.severity == Severity.SPECIAL_INFO) {
                this.connection.push(event);
            }
            if (event.severity >= this.minimum_lock_severity) {
                this.manager.client.state.lock();
                this.submitEvent(Severity.SPECIAL_INFO, "Client session locked", {
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
    }
}
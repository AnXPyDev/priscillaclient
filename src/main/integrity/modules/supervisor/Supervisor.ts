import assert from "assert";
import IntegrityEvent from "../../IntegrityEvent";
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
    connection: Axios;
    secret: string;

    constructor(connection: Axios, secret: string) {
        super();
        this.connection = connection;
        this.secret = secret;
    }

    async connect() {}
    async disconnect() {}
    async push(event: IntegrityEvent) {
        await this.connection.post("/client/supervisor/pushevent", {
            "secret": this.secret,
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

export default class Supervisor extends IntegrityModule {
    socket?: Socket;
    connection!: Connection;

    getName(): string {
        return "Supervisor";
    }

    start(): void {
        /*
        const socket = io("ws://localhost:3001/supervisor", {
            auth: {
                secret: this.manager.client.secret
            }
        });

        socket.on("message", (message) => {
            console.log(`Supervisor message: ${message}`)
        });

        this.manager.emitter.on("IE", (event: IntegrityEvent) => {
            socket.emit("integrityEvent", event);
        });

        this.socket = socket;
        */

        this.connection.connect();

        this.manager.emitter.on("IE", (event: IntegrityEvent) => {
            this.connection.push(event);
        });
    }

    stop(): void {
       this.connection.disconnect();
    }

    configure(options?: object): void {
        const client = this.manager.client;
        const server = this.manager.client?.server;
        const protocol: string = options?.['protocol'] ?? server?.features['supervisor']?.['protocol'] ?? "log";

        if (protocol == 'http') {
            this.connection = new HttpConnection(server.connection, client.secret);
        } else if (protocol == 'log') {
            this.connection = new LogConnection();
        }
    }
}
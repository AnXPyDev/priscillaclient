import IntegrityEvent from "../../IntegrityEvent";
import IntegrityModule, { IntegrityModuleFactory } from "../../IntegrityModule";
import { Socket, io as connectSocket, io } from 'socket.io-client';


export class SupervisorFactory extends IntegrityModuleFactory {
    create(): IntegrityModule {
        return new Supervisor();
    }
}

export default class Supervisor extends IntegrityModule {

    socket?: Socket;

    getName(): string {
        return "Supervisor";
    }

    start(): void {
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
    }

    stop(): void {
        this.socket?.disconnect()
    }
}
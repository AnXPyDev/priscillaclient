import { Client } from "socket.io/dist/client";
import IntegrityModule, { IntegrityModuleFactory } from "../../IntegrityModule";

export class SupervisorFactory extends IntegrityModuleFactory {
    create(): IntegrityModule {
        return new Supervisor();
    }
}

interface SueprvisorOptions {
    port: string
};

export default class Supervisor extends IntegrityModule {
    port!: string

    getName(): string {
        return "Supervisor";
    }
    start(): void {
    }
    stop(): void {
    }

    override configure(options?: object): void {

    }
}
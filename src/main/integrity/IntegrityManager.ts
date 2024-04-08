import EventEmitter from "events";
import Client from "../Client";
import IntegrityEvent, { Severity } from "./IntegrityEvent";
import IntegrityModule, { IntegrityModuleFactory } from "./IntegrityModule";
import { VanguardFactory } from "./modules/vanguard/Vanguard";
import { SupervisorFactory } from "./modules/supervisor/Supervisor";

const availableModules: {
    [name: string]: IntegrityModuleFactory
} = {
    "vanguard": new VanguardFactory(),
    "supervisor": new SupervisorFactory()
};

export interface IntegrityConfiguration {
    modules: { name: string, configuration?: object }[],
};

export default class IntegrityManager {
    client: Client;
    modules: IntegrityModule[] = [];
    eventLog: IntegrityEvent[] = [];
    emitter: EventEmitter = new EventEmitter();

    constructor(client: Client) {
        this.client = client;
    }

    addModule(module: IntegrityModule) {
        module.attach(this);
        this.modules.push(module);
        console.log(`Added module ${module.getName()}`);
    }

    submitEvent(event: IntegrityEvent) {
        this.eventLog.push(event);
        this.emitter.emit("IE", event);
        //console.log(event.toString());
    }

    start() {
        for (const module of this.modules) {
            module.start();
        }
    }

    stop() {
        for (const module of this.modules) {
            module.stop();
        }
    }

    configure(options: IntegrityConfiguration) {
        for (const module of options.modules) {
            const factory = availableModules[module.name];
            if (!factory) {
                console.error(`IntegrityManager: Module ${module.name} not found`);
                continue;
            }

            const im = factory.create();
            this.addModule(im);
            im.configure(module.configuration);
        }
    }
};
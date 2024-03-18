import Application from "../Application";
import IntegrityEvent, { Severity } from "./IntegrityEvent";
import IntegrityModule from "./IntegrityModule";

export default class IntegrityManager {
    application: Application;
    modules: IntegrityModule[] = [];
    events: IntegrityEvent[] = [];

    constructor(application: Application) {
        this.application = application;
    }

    addModule(module: IntegrityModule) {
        module.attach(this);
        this.modules.push(module);
    }

    submitEvent(event: IntegrityEvent) {
        this.events.push(event);
        console.log(event.toString());
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


};
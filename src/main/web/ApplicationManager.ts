import { Rect } from "@shared/types";
import Client from "@/Client";
import Application, { ApplicationConfiguration } from "@/web/Application";
import IntegrityModule from "@/integrity/IntegrityModule";
import IntegrityEvent from "@/integrity/IntegrityEvent";

export default class ApplicationManager {
    client: Client;
    apps = new Map<string, {
        app: Application,
        attached: boolean
    }>();

    focused?: Application;

    constructor(client: Client) {
        this.client = client;
    }

    submitEvent(event: IntegrityEvent) {
        this.client.integrityManager.submitEvent(event);
    }

    create(name: string, profile: string) {
        if (this.apps.has(name)) {
            console.warn(`Application ${name} already exists`);
            return 1;
        }
        const v = {
            app: new Application(this, name, this.client.webProfileManager.get(profile)),
            attached: false
        };

        v.app.onFocus(() => {
            this.focused = v.app;
        })

        this.apps.set(name, v);
        console.log(`Application ${name} create`);
        return 0;
    }

    configure(apps: ApplicationConfiguration[]) {
        for (const app of apps) {
            this.create(app.name, app.webprofile);
        }
    }

    destroy(name: string) {
        const v = this.apps.get(name);
        if (!v) {
            console.warn(`App ${name} does not exist`);
            return 1;
        }
        v.app.destroy();
        this.apps.delete(name);
        return 0;
    }

    attach(id: string) {
        const v = this.apps.get(id);
        if (!v) {
            console.warn(`View ${id} does not exist`);
            return 1;
        }
        if (v.attached) {
            console.warn(`View ${id} already attached`);
            return 1;
        }
        //console.log(`attach ${id}`);
        v.app.attach(this.client.window);
        v.attached = true;
        this.focused = v.app;
        return 0;
    }

    detach(id: string) {
        const v = this.apps.get(id);
        if (!v) {
            console.warn(`App ${id} does not exist`);
            return 1;
        }
        if (!v.attached) {
            console.warn(`App ${id} not attached`);
            return 1;
        }
        //console.log(`detach ${id}`);
        v.app.detach(this.client.window);
        v.attached = false;
        this.focused = undefined;
        return 0;
    }

    resize(id: string, rect: Rect) {
        const v = this.apps.get(id);
        if (!v) {
            console.warn(`View ${id} does not exist`);
            return 1;
        }
        const zoom = this.client.window.webContents.zoomFactor;
        v.app.resize({
            x: Math.floor(rect.x * zoom),
            y: Math.floor(rect.y * zoom),
            width: Math.ceil(rect.w * zoom),
            height: Math.ceil(rect.h * zoom)
        });
        return 0;
    }

    back() {
        this.focused?.back();
    }

    forward() {
        this.focused?.forward();
    }

    home() {
        this.focused?.home();
    }

}
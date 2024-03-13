import { Rect } from "@/shared/types";
import Application from "./Application";
import { BrowserView } from "electron";
import SecureBrowserView from "./SecureBrowserView";

export default class ViewManager {
    app: Application;
    views = new Map<string, {
        view: SecureBrowserView,
        attached: boolean
    }>();

    constructor(app: Application) {
        this.app = app;
    }

    create(id: string, profile: string) {
        if (this.views.has(id)) {
            console.warn(`View ${id} already exists`);
            return 1;
        }
        const v = {
            view: new SecureBrowserView(this.app.webProfileManager.get(profile)),
            attached: false
        };

        this.views.set(id, v);
        return 0;
    }

    attach(id: string) {
        const v = this.views.get(id);
        if (!v) {
            console.warn(`View ${id} does not exist`);
            return 1;
        }
        if (v.attached) {
            console.warn(`View ${id} already attached`);
            return 1;
        }
        console.log(`attach ${id}`);
        v.view.attach(this.app.window);
        v.attached = true;
        return 0;
    }

    detach(id: string) {
        const v = this.views.get(id);
        if (!v) {
            console.warn(`View ${id} does not exist`);
            return 1;
        }
        if (!v.attached) {
            console.warn(`View ${id} not attached`);
            return 1;
        }
        console.log(`detach ${id}`);
        v.view.detach(this.app.window);
        v.attached = false;
        return 0;
    }

    resize(id: string, rect: Rect) {
        const v = this.views.get(id);
        if (!v) {
            console.warn(`View ${id} does not exist`);
            return 1;
        }
        const zoom = this.app.window.webContents.zoomFactor;
        v.view.resize({
            x: Math.floor(rect.x * zoom),
            y: Math.floor(rect.y * zoom),
            width: Math.ceil(rect.w * zoom),
            height: Math.ceil(rect.w * zoom)
        });
        return 0;
    }

}
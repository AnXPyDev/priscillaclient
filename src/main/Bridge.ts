import { ipcMain } from 'electron';
import type { Rect } from '@shared/types';
import Application from '@/main/Application';


export default class Bridge {
    app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    on(signal: string, handler: (...args: any[]) => any) {
        ipcMain.on(signal, (event, ...args) => {
            event.returnValue = handler(...args) ?? 0;
        });
    }

    init() {
        this.on('BrowserView-create', (id: string, profile: string) => this.app.viewManager.create(id, profile));
        this.on('BrowserView-attach', (id: string) => this.app.viewManager.attach(id));
        this.on('BrowserView-detach', (id: string) => this.app.viewManager.detach(id));
        this.on('BrowserView-resize', (id: string, rect: Rect) => this.app.viewManager.resize(id, rect));
        this.on('Browser-home', () => this.app.viewManager.home());
        this.on('Browser-back', () => this.app.viewManager.back());
        this.on('Browser-forward', () => this.app.viewManager.forward());
        this.on('Application-kiosk', () => this.app.kiosk());
        this.on('Application-quit', () => this.app.quit());
    }

}
import { ipcMain } from 'electron';
import type { Rect } from '@shared/types';
import Application from '@/main/Application';


export default class Bridge {
    app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    init() {
        ipcMain.on('BrowserView-create', (event, id: string, profile: string) => { event.returnValue = this.app.viewManager.create(id, profile); });
        ipcMain.on('BrowserView-attach', (event, id: string) => { event.returnValue = this.app.viewManager.attach(id); });
        ipcMain.on('BrowserView-detach', (event, id: string) => { event.returnValue = this.app.viewManager.detach(id); });
        ipcMain.on('BrowserView-resize', (event, id: string, rect: Rect) => { event.returnValue = this.app.viewManager.resize(id, rect); });
    }

}
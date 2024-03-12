import { BrowserWindow, BrowserView, ipcMain } from 'electron';

export default class Bridge {
    window: BrowserWindow;
    views: Map<string, BrowserView>;

    constructor(window: BrowserWindow) {
        this.window = window;
        this.views = new Map([]);

        ipcMain.on('BrowserView-attach', (event, id: string) => { event.returnValue = this.bw_attach(id); });
        ipcMain.on('BrowserView-detach', (event, id: string) => { event.returnValue = this.bw_detach(id); });
    }

    bw_attach(id: string) {
        return 'ok';
    }

    bw_detach(id: string) {
        return 'ok';
    }
}
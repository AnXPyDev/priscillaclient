import { BrowserWindow, BrowserView, ipcMain } from 'electron';
import type { Rect } from '@shared/types';


export default class Bridge {
    window: BrowserWindow;
    views = new Map<string, BrowserView>();

    constructor(window: BrowserWindow) {
        this.window = window;
        this.views = new Map([]);

        ipcMain.on('BrowserView-attach', (event, id: string) => { event.returnValue = this.bw_attach(id); });
        ipcMain.on('BrowserView-detach', (event, id: string) => { event.returnValue = this.bw_detach(id); });
        ipcMain.on('BrowserView-resize', (event, id: string, rect: Rect) => { event.returnValue = this.bw_resize(id, rect); });
    }

    bw_attach(id: string) {
        let bw = this.views.get(id);
        if (!bw) {
            bw = new BrowserView();
            bw.webContents.loadURL("https://electronjs.org");
            this.views.set(id, bw);
        }

        this.window.setBrowserView(bw);

        return 0;
    }

    bw_detach(id: string) {
        let bw = this.views.get(id);
        if (bw) {
            this.window.removeBrowserView(bw);
        }
        return 0;
    }

    bw_resize(id: string, rect: Rect) {
        let bw = this.views.get(id);
        if (!bw) {
            return 1;
        }

        const zoom = this.window.webContents.zoomFactor;
        const bounds = {
            x: Math.floor(rect.x * zoom),
            y: Math.floor(rect.y * zoom),
            width: Math.ceil(rect.w * zoom),
            height: Math.ceil(rect.h * zoom)
        };

        bw.setBounds(bounds);
        return 0;
    }
}
import { ipcMain } from 'electron';
import type { Rect } from '@shared/types';
import Client from '@/Client';


export default class Bridge {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    on(signal: string, handler: (...args: any[]) => any) {
        ipcMain.on(signal, (event, ...args) => {
            event.returnValue = handler(...args) ?? 0;
        });
    }

    send(signal: string, ...args) {
        this.client.window.webContents.send(signal, ...args);
    }

    init() {
        this.on('Application-attach', (id: string) => this.client.appManager.attach(id));
        this.on('Application-detach', (id: string) => this.client.appManager.detach(id));
        this.on('Application-resize', (id: string, rect: Rect) => this.client.appManager.resize(id, rect));
        this.on('Application-home', () => this.client.appManager.home());
        this.on('Application-back', () => this.client.appManager.back());
        this.on('Application-forward', () => this.client.appManager.forward());
        this.on('Client-quit', () => this.client.quit());
        this.on('Client-testLock', () => this.client.state.lock());
    }

}
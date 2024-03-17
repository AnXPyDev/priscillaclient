export default class Bridge {
    log: boolean
    constructor(log: boolean) {
        this.log = log;
    }

    sendSync(signal: string, ...args): any {
        const response = window.electron.ipcRenderer.sendSync(signal, ...args);
        if (this.log) {
            console.log(`Bridge RND: ${signal} -> ${response}`);
        }
        return response;
    }


    sendOneWay(signal: string, ...args): void {
       window.electron.ipcRenderer.send(signal, ...args);
    }

    async send(signal: string, ...args): Promise<any> {
        return this.sendSync(signal, ...args);
    }
}

export const bridge = new Bridge(true);
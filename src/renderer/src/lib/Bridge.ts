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

    async send(signal: string, ...args): Promise<any> {  
        return this.sendSync(signal, ...args);
    }
}
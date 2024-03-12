export default class BrowserView {
    id: string;
    element: HTMLElement;
    observer: ResizeObserver;

    constructor(id: string, element: HTMLElement) {
        this.id = id;
        this.element = element;
        this.observer = new ResizeObserver((...args) => {
            this.onResize(...args);
        });
        this.observer.observe(this.element);
    }

    attach() {
        var response: string = window.electron.ipcRenderer.sendSync('BrowserView-attach', this.id);
        console.log(`renderer: BrowserView-attach ${this.id} ${response}`);
    }

    detach() {
        var response: string = window.electron.ipcRenderer.sendSync('BrowserView-detach', this.id);
        console.log(`renderer: BrowserView-detach ${this.id} ${response}`);
    }

    onResize(...args) {
        console.log(...args);
    }
};
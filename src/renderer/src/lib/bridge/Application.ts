import Bridge from '@/lib/Bridge';
import type { Rect } from '@shared/types';

export default class Application {
    bridge: Bridge;
    id: string;
    observer: ResizeObserver;

    constructor(bridge: Bridge, id: string) {
        this.bridge = bridge;
        this.id = id;
        this.observer = new ResizeObserver((entries) => {
            this.onResize(entries[0].target);
        });
    }

    attach(element: HTMLElement) {
        this.observer.disconnect();
        this.observer.observe(element);
        return this.bridge.send('Application-attach', this.id);
    }

    detach() {
        this.observer.disconnect();
        return this.bridge.send('Application-detach', this.id);
    }

    onResize(element: Element) {
        const rect = element.getClientRects()[0];

        return this.bridge.send('Application-resize', this.id, {
            x: rect.left, y: rect.top, w: rect.width, h: rect.height
        } as Rect);
    }
};
import Bridge from '@/lib/Bridge';
import type { Rect } from '@shared/types';

export default class BrowserView {
    bridge: Bridge;
    id: string;
    observer: ResizeObserver;

    constructor(bridge: Bridge, id: string, profile: string) {
        this.bridge = bridge;
        this.id = id;
        this.observer = new ResizeObserver((entries) => {
            this.onResize(entries[0].target);
        });

        this.bridge.send('BrowserView-create', this.id, profile);
    }

    attach(element: HTMLElement) {
        this.observer.disconnect();
        this.observer.observe(element);
        return this.bridge.send('BrowserView-attach', this.id);
    }

    detach() {
        this.observer.disconnect();
        return this.bridge.send('BrowserView-detach', this.id);
    }

    destroy() {
        return this.bridge.send('BrowserView-destroy', this.id);
    }

    onResize(element: Element) {
        const rect = element.getClientRects()[0];

        return this.bridge.send('BrowserView-resize', this.id, {
            x: rect.left, y: rect.top, w: rect.width, h: rect.height
        } as Rect);
    }
};
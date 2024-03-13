import Bridge from '@/lib/Bridge';
import type { Rect } from '@shared/types';

export default class BrowserView {
    bridge: Bridge;
    id: string;
    element: HTMLElement;
    observer: ResizeObserver;

    constructor(bridge: Bridge, id: string, element: HTMLElement) {
        this.bridge = bridge;
        this.id = id;
        this.element = element;
        this.observer = new ResizeObserver((...args) => {
            this.onResize();
        });
        this.observer.observe(this.element);
    }

    create(profile: string) {
        return this.bridge.send('BrowserView-create', this.id, profile);
    }

    attach() {
        return this.bridge.send('BrowserView-attach', this.id);
    }

    detach() {
        return this.bridge.send('BrowserView-detach', this.id);
    }

    onResize() {
        const rect = this.element.getClientRects()[0];

        return this.bridge.send('BrowserView-resize', this.id, {
            x: rect.left, y: rect.top, w: rect.width, h: rect.height
        } as Rect);
    }
};
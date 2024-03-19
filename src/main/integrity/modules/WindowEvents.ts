import { Severity } from "../IntegrityEvent";
import IntegrityModule from "../IntegrityModule";

export default class WindowEvents extends IntegrityModule {
    focusListener = () => {
        this.submitEvent(Severity.INFO, "Focus gain");
    };

    hideListener = () => {
        this.submitEvent(Severity.INFO, "Focus loss");
    };

    getName(): string {
        return "WindowEvents";
    }

    start(): void {
        const window = this.manager.application.window;
        window.on('focus', this.focusListener);
        window.on('hide', this.hideListener);
    }
    
    stop(): void {
        const window = this.manager.application.window;
        window.removeListener('focus', this.focusListener);
        window.removeListener('hide', this.hideListener);
    }
}
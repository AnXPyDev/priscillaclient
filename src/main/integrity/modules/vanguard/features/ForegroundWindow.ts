import { Severity } from "@/main/integrity/IntegrityEvent";
import VanguardFeature, { VanguardMessageCode } from "../VanguardFeature";

export default class ForegroundWindow extends VanguardFeature {
    window_handle!: Buffer;
    last_detected_window_handle!: Buffer;

    start(): void {
        this.window_handle = this.vanguard.manager.application.window.getNativeWindowHandle(); 
        this.last_detected_window_handle = this.window_handle;
    }

    codes(): VanguardMessageCode[] {
        return [VanguardMessageCode.FOREGROUND_WINDOW];
    }

    handleFGW(handle: Buffer) {
        if (this.last_detected_window_handle.equals(handle)) {
            return;
        }

        this.last_detected_window_handle = handle;

        if (!this.window_handle.equals(handle)) {
            this.vanguard.submitEvent(Severity.BREACH, `Different window in foreground ${handle.toString("hex")}`);
        } else {
            this.vanguard.submitEvent(Severity.INFO, "Client back in foreground");
        }
    }

    handleMessage(code: VanguardMessageCode, message: Buffer): void {
        switch (code) {
            case VanguardMessageCode.FOREGROUND_WINDOW:
                this.handleFGW(message);
                break;  
        }
    }
    
}
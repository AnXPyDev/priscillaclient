import { Severity } from "@/main/integrity/IntegrityEvent";
import VanguardFeature, { VanguardMessageCode } from "../VanguardFeature";

export default class ForegroundWindow extends VanguardFeature {
    // @ts-ignore
    window_handle: bigint;
    // @ts-ignore
    last_detected_window_handle: bigint;

    start(): void {
        this.window_handle = this.vanguard.manager.application.window.getNativeWindowHandle().readBigInt64LE();
        this.last_detected_window_handle = this.window_handle;
    }

    codes(): VanguardMessageCode[] {
        return [VanguardMessageCode.FOREGROUND_WINDOW];
    }

    handleFGW(message: Buffer) {
        const handle = message.readBigInt64LE();

        if (this.last_detected_window_handle == handle) {
            return;
        }

        this.last_detected_window_handle = handle;

        if (this.window_handle != handle) {
            this.vanguard.submitEvent(Severity.BREACH, `Different window in foreground ${handle}`);
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
import { Severity } from "@/main/integrity/IntegrityEvent";
import VanguardFeature, { VanguardFeatureFactory } from "../VanguardFeature";
import { FeatureCode, MessageCode, VanguardMessage, VanguardRequestJobStart } from "../VanguardDecl";

export class ForegroundWindowFactory extends VanguardFeatureFactory {
    create(): VanguardFeature {
        return new ForegroundWindow();
    }
}

export default class ForegroundWindow extends VanguardFeature {
    window_handle!: Buffer;
    last_detected_window_handle!: Buffer;

    start(): void {
        this.window_handle = this.vanguard.manager.client.window.getNativeWindowHandle(); 
        this.last_detected_window_handle = this.window_handle;

        this.vanguard.sendRequest(new VanguardRequestJobStart(
            1, FeatureCode.FEATURE_GET_FOREGROUND_WINDOW, 100
        ));
    }

    codes(): MessageCode[] {
        return [MessageCode.MESSAGE_GET_FOREGROUND_WINDOW];
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

    handleMessage(message: VanguardMessage): void {
        switch (message.code) {
            case MessageCode.MESSAGE_GET_FOREGROUND_WINDOW:
                this.handleFGW(message.message!!);
                break;  
        }
    }
    
}
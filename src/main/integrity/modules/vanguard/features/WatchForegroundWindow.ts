import { Severity } from "@/main/integrity/IntegrityEvent";
import VanguardFeature, { VanguardFeatureFactory } from "../VanguardFeature";
import { FeatureCode, MessageCode, VanguardMessage, VanguardRequestJobStart } from "../VanguardDecl";

export class WatchForegroundWindowFactory extends VanguardFeatureFactory {
    create(): VanguardFeature {
        return new WatchForegroundWindow();
    }
}

export default class WatchForegroundWindow extends VanguardFeature {
    start(): void {
        this.vanguard.sendRequest(new VanguardRequestJobStart(
            1, FeatureCode.FEATURE_WATCH_FOREGROUND_WINDOW, 100
        ));
    }

    codes(): MessageCode[] {
        return [
            MessageCode.MESSAGE_WRONG_FOREGROUND_WINDOW,
            MessageCode.MESSAGE_CLIENT_FOREGROUND_WINDOW,
            MessageCode.MESSAGE_CHILD_FOREGROUND_WINDOW
        ];
    }

    handleWrong(message: Buffer) {
        const handle: Buffer = message.subarray(undefined, 8);
        const title: Buffer = message.subarray(8);
        this.vanguard.submitEvent(Severity.BREACH, `Wrong window in foreground`, {
            handle: handle.toString("hex"),
            title: title.toString("utf-8")
        });
    }

    handleMessage(message: VanguardMessage): void {
        switch (message.code) {
            case MessageCode.MESSAGE_WRONG_FOREGROUND_WINDOW:
                this.handleWrong(message.message!!);
                break;  
            case MessageCode.MESSAGE_CLIENT_FOREGROUND_WINDOW:
                this.vanguard.submitEvent(Severity.WARNING, `Client window is back in foreground`);
                break;
            case MessageCode.MESSAGE_CHILD_FOREGROUND_WINDOW:
                this.vanguard.submitEvent(Severity.WARNING, `Child window is in foreground`);
                break;
        }
    }
    
}
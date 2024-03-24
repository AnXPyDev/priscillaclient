import Vanguard from "./Vanguard";
import { MessageCode, VanguardMessage } from "./VanguardDecl";

export abstract class VanguardFeatureFactory {
    abstract create(): VanguardFeature;
}

export default abstract class VanguardFeature {
    vanguard!: Vanguard;

    attach(vanguard: Vanguard) {
        this.vanguard = vanguard;
    }

    start() {}
    stop() {}

    configure(options?: object): void {};

    abstract codes(): MessageCode[];
    abstract handleMessage(message: VanguardMessage): void;
}
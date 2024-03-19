import Vanguard from "./Vanguard";

export enum VanguardMessageCode {
    FOREGROUND_WINDOW = 0
};

export default abstract class VanguardFeature {
    vanguard!: Vanguard;

    attach(vanguard: Vanguard) {
        this.vanguard = vanguard;
    }

    start() {}
    stop() {}

    abstract codes(): VanguardMessageCode[];
    abstract handleMessage(code: VanguardMessageCode, message: Buffer): void;
}
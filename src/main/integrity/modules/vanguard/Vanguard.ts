import IntegrityModule from "@/main/integrity/IntegrityModule";
import { ChildProcess, spawn } from "child_process";

import VanguardFeature, { VanguardMessageCode } from "./VanguardFeature";
import ForegroundWindow from "./features/ForegroundWindow";

export default class Vanguard extends IntegrityModule {
    // @ts-ignore
    process: ChildProcess;

    features: VanguardFeature[] = [];
    codeMap = new Map<VanguardMessageCode, VanguardFeature>();

    constructor() {
        super();
        this.addFeature(new ForegroundWindow());
    }

    getName(): string {
        return "Vanguard";
    }

    start(): void {
        for (const feature of this.features) {
            feature.start();
        }

        this.process = spawn('vanguard.exe');
        this.process.stdout?.on('data', (buffer: Buffer) => {
            const mcode = buffer.subarray(0, 4).readInt32LE();
            if (!(mcode in VanguardMessageCode)) {
                console.error(`Vanguard: unknown message code received ${mcode}`);
                return;
            }

            const message = buffer.subarray(4);
            const feature = this.codeMap.get(mcode as VanguardMessageCode);
            if (!feature) {
                console.error(`Vanguard: no handler for code ${VanguardMessageCode[mcode]} registered`);
                return;
            }

            feature.handleMessage(mcode as VanguardMessageCode, message);
        });
    }

    addFeature(feature: VanguardFeature) {
        feature.attach(this);
        this.features.push(feature);

        for (const code of feature.codes()) {
            if (this.codeMap.has(code)) {
                console.warn(`Vanguard: Message Code ${VanguardMessageCode[code]} already registered`);
                continue;
            }

            this.codeMap.set(code, feature);
        }
    }

    stop(): void {
        this.process.kill("SIGTERM");

        for (const feature of this.features) {
            feature.stop();
        }
    }

}
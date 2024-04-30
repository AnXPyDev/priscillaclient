import IntegrityModule, { IntegrityModuleFactory } from "@/integrity/IntegrityModule";
import { ChildProcess, spawn } from "child_process";

import VanguardFeature from "./VanguardFeature";
import { FeatureCode, MessageCode, VanguardMessage, VanguardRequest, VanguardRequestCommand } from "./VanguardDecl";

import availableFeatures from "./availableFeatures";


export interface VanguardConfiguration {
    features?: {
        [name: string]: object;
    }
}

export class VanguardFactory extends IntegrityModuleFactory {
    create(): IntegrityModule {
        return new Vanguard();
    }
}

export default class Vanguard extends IntegrityModule {
    process!: ChildProcess;

    features: VanguardFeature[] = [];
    codeMap = new Map<MessageCode, VanguardFeature>();

    getName(): string {
        return "Vanguard";
    }

    start(): void {
        this.process = spawn('vanguard.exe');
        this.process.stdout?.on('data', (unread: Buffer) => this.readMessages(unread));
        this.process.stderr?.on('data', (data: Buffer) => {
            console.log(`Vanguard stderr: "${data.toString('utf8')}"`);
        });

        this.sendRequest(new VanguardRequestCommand(
            FeatureCode.FEATURE_SET_HANDLE,
            this.manager.client.window.getNativeWindowHandle()
        ));

        for (const feature of this.features) {
            feature.start();
        }
    }

    addFeature(feature: VanguardFeature) {
        feature.attach(this);
        this.features.push(feature);

        for (const code of feature.codes()) {
            if (this.codeMap.has(code)) {
                console.warn(`Vanguard: Message Code ${MessageCode[code]} already registered`);
                continue;
            }

            this.codeMap.set(code, feature);
        }
    }

    stop(): void {
        for (const feature of this.features) {
            feature.stop();
        }

        this.process.kill("SIGTERM");
    }

    sendRequest(request: VanguardRequest) {
        this.process.stdin?.write(request.toBuffer());
    }


    async handleMessage(message: VanguardMessage) {
        const feature = this.codeMap.get(message.code);
        if (!feature) {
            console.error(`Vanguard: no feature registered for message code ${MessageCode[message.code]}`);
            return;
        }
        feature.handleMessage(message);
    }

    readMessages(unread: Buffer) {
        while (unread.length >= 8) {
            const r = VanguardMessage.take(unread);
            unread = r.unread;
            this.handleMessage(r.message);
        }
    }

    override configure(options: VanguardConfiguration) {
        if (!options.features) {
            return;
        }

        for (const name in options.features) {
            const factory = availableFeatures[name];
            if (!factory) {
                console.error(`Vanguard: Feature ${name} not found`);
                return;
            }


            const conf = options.features[name]; 

            const feature = factory.create();
            feature.configure(conf);
            this.addFeature(feature);
        }
    }


}
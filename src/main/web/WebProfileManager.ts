import Client from "@/Client";
import WebProfile, { WebProfileFactory } from "./WebProfile";
import { SequenceProfileFactory } from "./SequenceProfile";
import { StandardProfile, StandardProfileFactory } from "./StandardProfile";

const defaultFactory = new StandardProfileFactory();

const factories: {
    [type: string]: WebProfileFactory
} = {
    "default": defaultFactory,
    "sequence": new SequenceProfileFactory()
}

export default class WebProfileManager {
    client: Client;
    profiles = new Map<string, WebProfile>();
    defaultProfile = new StandardProfile("default", {
        homepage: "https://fpvai.ukf.sk",
    });

    constructor(client: Client) {
        this.client = client;
    }

    get(name: string): WebProfile {
        let profile = this.profiles.get(name);
        if (!profile) {
            console.warn(`WebProfile ${name} not found, using default`);
            profile = this.defaultProfile;
        }
        return profile;
    }


    add(profile: WebProfile) {
        if (this.profiles.has(profile.name)) {
            console.warn(`WebProfile ${profile.name} already registered`);
            return;
        }
        this.profiles.set(profile.name, profile);
        profile.attach(this);
    }


    configure(profiles: {
        [name: string]: { type?: string }
    }) {
        for (const profile in profiles) {
            const configuration = profiles[profile];

            let factory = defaultFactory;
            if (configuration.type) {
                factory = factories[configuration.type] ?? factory;
            }

            this.add(factory.create(profile, configuration));
        }
    }
}
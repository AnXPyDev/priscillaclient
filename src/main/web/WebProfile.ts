import { Session, app, session } from "electron";
import WebFilter from "./WebFilter";
import { Sieve } from "./WebFilter";
import Application from "../Application";
import IntegrityEvent, { Severity } from "../integrity/IntegrityEvent";

export class WebProfile {
    name: string;
    filters: WebFilter[];
    log: boolean;
    homepage: string;
    manager!: WebProfileManager;

    constructor(name: string, options: {
        filters?: WebFilter[],
        filter?: WebFilter,
        homepage?: string,
        log?: boolean
    } = {}) {
        this.name = name;
        this.filters = options.filters ?? (options.filter && [options.filter]) ?? [];
        this.log = options.log ?? false;
        this.homepage = options.homepage ?? "https://fpvai.ukf.sk";
        if (this.filters.length == 0) {
            console.warn(`WebProfile ${this.name} has no filters`);
        }
    }

    attach(manager: WebProfileManager) {
        this.manager = manager;
    }

    isAllowedURL(url: string): boolean {
        for (const filter of this.filters) {
            if (filter.isAllowedURL(url)) {
                return true;
            }
        }

        const integrityManager = this.manager.application.integrityManager;
        integrityManager.submitEvent(new IntegrityEvent("WebProfile", new Date(Date.now()), Severity.INFO, `${this.name} BLOCKED ${url}`));

        return false;
    }

    getSession(): Session {
        const sess = session.fromPartition(Math.random().toString(), { cache: false });
        sess.webRequest.onBeforeRequest((details, callback) => callback({ cancel: !this.isAllowedURL(details.url)}));
        return sess;
    }
}

export class WebProfileManager {
    application: Application;
    profiles = new Map<string, WebProfile>();
    defaultProfile = new WebProfile("defaultProfile", { filter: new Sieve() });

    constructor(application: Application) {
        this.application = application;
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

}
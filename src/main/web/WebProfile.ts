import { Session, session } from "electron";
import WebFilter from "./WebFilter";
import { Sieve } from "./WebFilter";
import { URL } from "url";

export class WebProfile {
    name: string;
    filters: WebFilter[];
    log: boolean;
    homepage: string;

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

    isAllowedURL(url: string): boolean {
        for (const filter of this.filters) {
            if (filter.isAllowedURL(url)) {
                return true;
            }
        }

        console.warn(`Profile ${this.name} BLOCKED ${url}`);
        return false;
    }

    getSession(): Session {
        const sess = session.fromPartition(Math.random().toString(), { cache: false });
        sess.webRequest.onBeforeRequest((details, callback) => callback({ cancel: !this.isAllowedURL(details.url)}));
        return sess;
    }
}

export class WebProfileManager {
    profiles = new Map<string, WebProfile>();
    defaultProfile = new WebProfile("defaultProfile", { filter: new Sieve() });

    get(name: string): WebProfile {
        let profile = this.profiles.get(name);
        if (!profile) {
            console.warn(`WebProfile ${name} not found, using default`);
            profile = this.defaultProfile;
        }
        return profile;
    }

    add(name: string, profile: WebProfile) {
        if (this.profiles.has(name)) {
            console.warn(`WebProfile ${name} already exists`);
            return;
        }
        this.profiles.set(name, profile);
    }

}
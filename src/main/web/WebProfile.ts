import { Session, session } from "electron";
import WebFilter, { DomainWebFilter } from "./WebFilter";
import IntegrityEvent, { Severity } from "../integrity/IntegrityEvent";
import WebProfileManager from "./WebProfileManager";

interface WebProfileConfiguration {
    whitelist?: string[],
    homepage?: string
}

export class WebProfileFactory {
    create(name: string, configuration: object): WebProfile {
        return WebProfile.fromConfig(name, configuration);
    }
}

export default class WebProfile {
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

    static fromConfig(name: string, options: WebProfileConfiguration): WebProfile {
        let filter: WebFilter;
        if (options.whitelist) {
            filter = new DomainWebFilter(options.whitelist.map((regex) => new RegExp(regex)));
        }

        return new WebProfile(name, {
            filter: options.whitelist && new DomainWebFilter(
                options.whitelist.map((regex) => new RegExp(regex))
            ),
            homepage: options.homepage
        });
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

        const integrityManager = this.manager.client.integrityManager;
        integrityManager.submitEvent(new IntegrityEvent("WebProfile", new Date(Date.now()), Severity.INFO, `${this.name} BLOCKED ${url}`));

        return false;
    }

    canNavigateURL(url: string): boolean {
        return this.isAllowedURL(url);
    }

    onNavigate(url: string) {}
    onRequest(url: string) {}

    getHomepage(): string {
        return this.homepage;
    }

    getSession(): Session {
        const sess = session.fromPartition(Math.random().toString(), { cache: false });
        sess.webRequest.onBeforeRequest((details, callback) => {
            const allowed = this.isAllowedURL(details.url);
            callback({ cancel: !allowed })
            if (allowed) {
                this.onRequest(details.url);
            }
        });
        return sess;
    }
}

import WebFilter, { MatchWebFilter, RegexWebFilter } from "./WebFilter";
import WebProfile, { WebProfileFactory } from "./WebProfile";

interface StandardProfileOptions {
    whitelist?: string[],
    nav_whitelist?: string[],
    homepage: string
}

export class StandardProfileFactory extends WebProfileFactory {
    create(name: string, configuration: object): WebProfile {
        return new StandardProfile(name, configuration as any);
    }
}

export class StandardProfile extends WebProfile {
    homepage: string;
    nav_filters: WebFilter[];
    req_filters: WebFilter[];

    constructor(name: string, options: StandardProfileOptions) {
        super();
        this.name = name;
        this.homepage = options.homepage!!;
        this.nav_filters = [ MatchWebFilter.fromList([this.homepage]), RegexWebFilter.fromList(options.nav_whitelist ?? [".*"]) ];
        this.req_filters = [ RegexWebFilter.fromList(options.whitelist ?? [".*"]) ];
    }

    canNavigateURL(url: string): boolean {
        for (const filter of this.nav_filters) {
            if (filter.isAllowedURL(url)) { return true };
        }
        return false;
    }
    
    canRequestURL(url: string) {
        for (const filter of this.req_filters) {
            if (filter.isAllowedURL(url)) { return true };
        }
        return this.canNavigateURL(url);
    }

    // @ts-expect-error
    onNavigate(url: string) {}
    // @ts-expect-error
    onRequest(url: string) {}

    getHomepage(): string {
        return this.homepage;
    }
}
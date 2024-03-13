import { RegularExpressionLiteral } from "typescript";

export default interface WebFilter {
    isAllowedURL(url: string): boolean;
}

export class Sieve implements WebFilter {
    isAllowedURL(url: string): boolean {
        return true;
    }
}

export class DomainWebFilter implements WebFilter {
    whitelist: RegExp[];
    constructor(whitelist: RegExp[]) {
        this.whitelist = whitelist;
    }

    isDomainAllowed(domain: string): boolean {
        for (const w of this.whitelist) {
            if (w.test(domain)) {
                return true;
            }
        }
        return false;
    }

    isAllowedURL(url: string): boolean {
        const https = "https://";
        if (!url.startsWith(https)) {
            return false;
        }

        let domain = url.substring(https.length, url.indexOf("/", https.length));
        return this.isDomainAllowed(domain);
    }
}
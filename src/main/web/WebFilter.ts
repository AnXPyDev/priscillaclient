export default interface WebFilter {
    isAllowedURL(url: string): boolean;
}

export class Sieve implements WebFilter {
    // @ts-expect-error
    isAllowedURL(url: string): boolean {
        return true;
    }
}

export class MatchWebFilter implements WebFilter {
    whitelist: string[];
    constructor(whitelist: string[]) {
        this.whitelist = whitelist;
    }

    static fromList(urls: string[]) {
        return new MatchWebFilter(urls);
    }

    isAllowedURL(url: string): boolean {
        for (const w of this.whitelist) {
            if (url == w) { return true; }
        }
        return false;
    }
}

export class RegexWebFilter implements WebFilter {
    whitelist: RegExp[];
    constructor(whitelist: RegExp[]) {
        this.whitelist = whitelist;
    }

    static fromList(regexs: string[]) {
        return new RegexWebFilter(regexs.map((regex) => new RegExp(regex)));
    }

    isAllowedURL(url: string): boolean {
        for (const w of this.whitelist) {
            if (w.test(url)) { return true; }
        }
        return false;
    }
}
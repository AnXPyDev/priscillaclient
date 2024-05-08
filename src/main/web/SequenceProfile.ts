import { Severity } from "@/integrity/IntegrityEvent";
import WebFilter, { CallbackWebFilter, RegexWebFilter } from "@/web/WebFilter";
import WebProfile, { WebProfileFactory } from "@/web/WebProfile";

export class SequenceProfileFactory extends WebProfileFactory {
    override create(name: string, configuration: object): WebProfile {
        return new SequenceProfile(name, configuration);
    }
}

interface StageOptions {
    entry?: string
    homepage?: string
    exits?: {
        triggers?: string[]
        target?: string
        message?: string
        emit?: string
    }[]
    whitelist?: string[]
    nav_whitelist?: string[]
}

interface SequenceProfileOptions {
    whitelist?: string[]
    nav_whitelist?: string[]
    stages?: {
        [name: string]: StageOptions
    }
    begin?: string
}

class Stage {
    profile: SequenceProfile;
    nav_filters: WebFilter[];
    req_filters: WebFilter[];
    entry?: string;
    homepage?: string;
    exits: {
        triggers: RegExp[],
        target: string,
        message?: string
        emit?: string
    }[];

    constructor(profile: SequenceProfile, options: StageOptions) {
        this.profile = profile;
        this.entry = options.entry;
        this.homepage = options.homepage ?? this.entry;
        this.nav_filters = [
            CallbackWebFilter.from((url: string) => {
                return this.entry == url || this.homepage == url;
            }),
            RegexWebFilter.fromList(options.nav_whitelist ?? [])
        ];

        this.req_filters = [ RegexWebFilter.fromList(options.nav_whitelist ?? []) ];
        this.exits = options.exits?.map((options) => ({
            triggers: options.triggers!!.map((regex) => new RegExp(regex)) ?? [],
            target: options.target!!,
            message: options.message,
            emit: options.emit
        })) ?? []
    }

    canNavigateURL(url: string) {
        for (const filter of this.nav_filters) {
            if (filter.isAllowedURL(url)) { return true };
        }
        return false;
    }
    
    canRequestURL(url: string) {
        for (const filter of this.req_filters) {
            if (filter.isAllowedURL(url)) { return true };
        }
        return false;
    }

    onNavigate(url: string) {
        for (const exit of this.exits) {
            for (const trigger of exit.triggers) {
                if (trigger.test(url)) {
                    this.profile.transitionStage(url, exit.target, exit.message, exit.emit);
                    return;
                }
            }
        }
    }

    getHomepage(): string {
        return this.homepage!!;
    }

    onTransition(url: string) {
        if (this.entry === undefined) {
            this.homepage = url;
        }
    }
}


export default class SequenceProfile extends WebProfile {
    stages: { [name: string]: Stage } = {};
    active_stage!: Stage;

    nav_filters: WebFilter[];
    req_filters: WebFilter[];

    constructor(name: string, options: SequenceProfileOptions) {
        super();

        this.name = name;

        options.stages!!;
        for (const stage_name in options.stages) {
            const stage_options = options.stages[stage_name];
            this.stages[stage_name] = new Stage(this, stage_options);
        }

        this.nav_filters = [ RegexWebFilter.fromList(options.nav_whitelist ?? [".*"]) ];
        this.req_filters = [ RegexWebFilter.fromList(options.whitelist ?? [".*"]) ];

        this.active_stage = this.stages[options.begin!!];
    }

    transitionStage(url: string, target: string, message?: string, emit?: string) {
        this.active_stage = this.stages[target]!!;
        this.active_stage.onTransition(url);
        this.application.loadURL(this.active_stage.getHomepage());
        if (message) {
            this.application.submitEvent(Severity.SPECIAL_INFO, message, { url });
            if (emit) {
                this.manager.client.emitter.emit(emit);
            }
        }
    }
    
    canNavigateURL(url: string) {
        for (const filter of this.nav_filters) {
            if (filter.isAllowedURL(url)) { return true; }
        }
        return this.active_stage.canNavigateURL(url);
    }

    canRequestURL(url: string) {
        for (const filter of this.req_filters) {
            if (filter.isAllowedURL(url)) { return true; }
        }
        return this.active_stage.canRequestURL(url) || this.canNavigateURL(url);
    }

    getHomepage(): string {
        return this.active_stage.getHomepage();
    }

    onNavigate(url: string) {
        console.error(`On navigate ${url}`);
        this.active_stage.onNavigate(url);
    }

    // @ts-expect-error
    onRequest(url: string) {}

}
import WebProfileManager from "@/web/WebProfileManager";
import Application from "@/web/Application";


export abstract class WebProfileFactory {
    abstract create(name: string, configuration: object): WebProfile
}

export default abstract class WebProfile {
    name!: string;
    manager!: WebProfileManager;
    application!: Application;

    abstract canNavigateURL(url: string)
    abstract canRequestURL(url: string)
    abstract getHomepage(): string
    abstract onNavigate(url: string)
    abstract onRequest(url: string)

    attach(manager: WebProfileManager) {
        this.manager = manager;
    }

    attachApplication(application: Application) {
        this.application = application;
    }
}

import { BrowserView, BrowserWindow, Session, session } from "electron";
import WebProfile from "@/web/WebProfile";
import ApplicationManager from "@/web/ApplicationManager";
import IntegrityEvent, { Severity } from "@/integrity/IntegrityEvent";

export interface ApplicationConfiguration {
    name: string,
    webprofile: string,
    start_open?: boolean
};

function makeSession(): Session {
    return session.fromPartition(Math.random().toString(), { cache: false });
}

export default class Application {
    manager: ApplicationManager;
    name: string;
    view: BrowserView;
    profile: WebProfile;
    session: Session;

    constructor(manager: ApplicationManager, name: string, profile: WebProfile) {
        this.manager = manager;
        this.name = name;
        this.profile = profile;

        this.session = makeSession();

        this.view = new BrowserView({
            webPreferences: {
                devTools: false,
                sandbox: true,
                session: this.session
            }
        });

        this.session.webRequest.onBeforeRequest((details, callback) => {
            const allowed = this.profile.canRequestURL(details.url);
            callback({ cancel: !allowed });
            if (!allowed) {
                this.submitEvent(Severity.INFO, "Blocked request", { url: details.url });
                return;
            }
            this.profile.onRequest(details.url);
        })

        const handleNavigation = (url: string, preventDefault: () => any, extras: object = {}, onNavigate: () => any = () => {}) => {
            if (!this.profile.canNavigateURL(url)) {
                preventDefault();
                this.submitEvent(Severity.INFO, "Prevented navigation", { url, ...extras });
                return;
            }
            onNavigate();
        }

        const webContents = this.view.webContents;

        webContents.on('will-navigate', (event) => {
            handleNavigation(event.url, () => event.preventDefault(), { event: 'will-navigate' });
        });

        webContents.on('will-frame-navigate', (event) => {
            handleNavigation(event.url, () => event.preventDefault(), { event: 'will-frame-navigate' });
        });

        webContents.on('will-redirect', (event) => {
            handleNavigation(event.url, () => event.preventDefault(), { event: 'will-redirect' });
        });
        
        webContents.on('did-start-navigation', (event) => {
            handleNavigation(event.url, () => event.preventDefault(), { event: 'did-start-navigation' });
        });
       
        // @ts-expect-error
        webContents.on('did-navigate-in-page', (event, url) => {
            handleNavigation(url, () => {
                this.loadURL(this.profile.getHomepage());
            }, { event: 'did-navigate-in-page' }, () => {
                this.profile.onNavigate(url);
            });
        });
        
        // @ts-expect-error
        webContents.on('did-navigate', (event, url) => {
            handleNavigation(url, () => {
                this.loadURL(this.profile.getHomepage());
            }, { event: 'did-navigate' }, () => {
                this.profile.onNavigate(url);
            });
        });

        /*
        // @ts-expect-error
        this.view.webContents.on('did-navigate-in-page', (event, url) => {
            console.error(`did-navigate-in-page ${url}`);
        })

        // @ts-expect-error
        this.view.webContents.on('did-frame-navigate', (event, url) => {
            console.error(`did-frame-navigate ${url}`);
        })
        this.view.webContents.on('will-redirect', (event, url) => {
            if (!this.profile.canNavigateURL(url)) {
                event.preventDefault();
                this.submitEvent(Severity.INFO, "Prevented redirect", { url });
            }
        })
        
        // @ts-expect-error
        this.view.webContents.on('did-redirect-navigation', (event, url) => {
            console.error(`did-redirect-navigation ${url}`);
        })
        
        // @ts-expect-error
        this.view.webContents.on('did-start-navigation', (event) => {
        })

        this.view.webContents.on('will-frame-navigate', (details) => {
            if (!this.profile.canNavigateURL(details.url)) {
                details.preventDefault();
                this.submitEvent(Severity.INFO, "Prevented navigation", { url: details.url });
                return;
            }
            this.profile.onNavigate(details.url);
        })

        // @ts-expect-error
        this.view.webContents.on('did-navigate-in-page', (event, url, isInPlace) => {
            if (!this.profile.canNavigateURL(url)) {
                this.loadURL(this.profile.getHomepage());
                this.submitEvent(Severity.INFO, "Prevented SPA navigation", { url });
                return;
            }
            this.profile.onNavigate(url);
        });
        
        // @ts-expect-error
        this.view.webContents.on('did-navigate', (event, url) => {
            if (!this.profile.canNavigateURL(url)) {
                this.loadURL(this.profile.getHomepage());
                this.submitEvent(Severity.INFO, "Prevented navigation", { url });
                return;
            }
            this.profile.onNavigate(url);
        })

        this.view.webContents.on('will-navigate', (event) => {
            handleNavigation(event.url, () => {
                event.preventDefault();
            });
        });
        */

        this.profile.attachApplication(this);
        this.home();
    }

    submitEvent(severity: Severity, message: string, data?: object) {
        this.manager.submitEvent(IntegrityEvent.create(`Application "${this.name}"`, severity, message, data));
    }

    loadURL(url: string) {
        this.view.webContents.loadURL(url);
    }

    destroy() {
    }

    attach(window: BrowserWindow) {
        window.addBrowserView(this.view);
    }

    detach(window: BrowserWindow) {
        window.removeBrowserView(this.view);
    }

    resize(bounds) {
        this.view.setBounds(bounds);
    }

    back() {
        this.view.webContents.goBack();
    }
    
    forward() {
        this.view.webContents.goForward();
    }

    home() {
        this.view.webContents.loadURL(this.profile.getHomepage());
    }

    onFocus(handler) {
        this.view.webContents.on('focus', handler);
    }
}
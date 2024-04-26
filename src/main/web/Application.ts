import { BrowserView, BrowserWindow } from "electron";
import WebProfile from "./WebProfile";

export interface ApplicationConfiguration {
    name: string,
    webprofile: string,
    start_open?: boolean
};

export default class Application {
    name: string;
    view: BrowserView;
    profile: WebProfile;

    constructor(name: string, profile: WebProfile) {
        this.name = name;
        this.profile = profile;
        this.view = new BrowserView({
            webPreferences: {
                devTools: false,
                sandbox: true,
                session: this.profile.getSession(),
            }
        });

        this.view.webContents.on('will-navigate', (event, url, isInPlace) => {
            if (!this.profile.canNavigateURL(url)) {
                event.preventDefault();
                return;
            }
            this.profile.onNavigate(url);
        });

        this.view.webContents.on('login', (event) => {
            console.log(`login: ${this.view.webContents.getURL()}`);
        });

        this.loadURL(this.profile.getHomepage())
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
        this.view.webContents.loadURL(this.profile.homepage);
    }

    onFocus(handler) {
        this.view.webContents.on('focus', handler);
    }
}
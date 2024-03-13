import { BrowserView, BrowserWindow } from "electron";
import { WebProfile } from "./web/WebProfile";

export default class SecureBrowserView {
    view: BrowserView;
    profile: WebProfile;

    constructor(profile: WebProfile) {
        this.profile = profile;
        this.view = new BrowserView({
            webPreferences: {
                devTools: false,
                sandbox: true,
                session: this.profile.getSession()
            }
        });

        this.view.webContents.on('will-navigate', (event, url, isInPlace) => {
            if (!this.profile.isAllowedURL(url)) {
                event.preventDefault();
            }
        });

        this.view.webContents.loadURL(this.profile.homepage);
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
}
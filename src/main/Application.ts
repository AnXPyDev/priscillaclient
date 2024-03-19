import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Bridge from '@/main/Bridge'
import ViewManager from './ViewManager'
import { WebProfile, WebProfileManager } from './web/WebProfile'
import { DomainWebFilter } from './web/WebFilter'
import IntegrityManager from './integrity/IntegrityManager'
import WindowEvents from './integrity/modules/WindowEvents'
import Vanguard from './integrity/modules/vanguard/Vanguard'

export default class Application {
    bridge = new Bridge(this);
    webProfileManager = new WebProfileManager(this);
    viewManager =  new ViewManager(this);
    integrityManager = new IntegrityManager(this);
    window!: BrowserWindow;

    isKiosk = false;

    constructor() {
        app.whenReady().then(() => this.init());

        app.on('window-all-closed', () => this.quit());
    }

    init() {
        this.bridge.init();
        this.initProfiles();

        electronApp.setAppUserModelId('ukf.priscillaclient')

        this.createWindow();
        
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        })
    }

    initIntegrity() {
        this.integrityManager.addModule(new WindowEvents());
        this.integrityManager.addModule(new Vanguard());
        this.integrityManager.start();
    }

    initProfiles() {
        this.webProfileManager.add(new WebProfile("priscilla", {
            filter: new DomainWebFilter([
                /.*\.fitped\.eu/,
                /cdn.\.*/,
                /cdnjs.\.*/,
                /fonts.\.*/
            ]),
            homepage: "https://priscilla.fitped.eu",
            log: true 
        }));
        this.webProfileManager.add(new WebProfile("translator", {
            filter: new DomainWebFilter([
                /translate\.google\..*/,
                /consent\.google\..*/,
                /.*gstatic\..*/
            ]),
            homepage: "https://translate.google.com",
            log: true 
        }));
    }

    createWindow() {
        this.window = new BrowserWindow({
            width: 1280,
            height: 720,
            show: false,
            autoHideMenuBar: true,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false
            }
        });

        this.window.on('ready-to-show', () => {
            this.window.show()
        })

        let first_show = true;
        this.window.on('show', () => {
            if (first_show) {
                console.log(`Window handle: ${this.window.getNativeWindowHandle().toString('hex')}`);
                this.initIntegrity();
                first_show = false;
            }
        })

        this.window.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url)
            return { action: 'deny' }
        })

        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            this.window.loadURL(process.env['ELECTRON_RENDERER_URL'])
        } else {
            this.window.loadFile(join(__dirname, '../renderer/index.html'))
        }
    }

    kiosk() {
        if (this.isKiosk) {
            this.isKiosk = false;
        } else {
            this.isKiosk = true;
        }

        this.window.setKiosk(this.isKiosk);
        this.window.setAlwaysOnTop(this.isKiosk, "screen-saver");
        this.window.setFullScreenable(!this.isKiosk);
        this.window.setFullScreen(this.isKiosk);
        this.window.setMinimizable(!this.isKiosk);
        this.window.setClosable(!this.isKiosk);
    }

    quit() {
        app.quit()
    }
};
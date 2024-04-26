import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Bridge from '@/main/Bridge'
import WebProfileManager from './web/WebProfileManager'
import IntegrityManager from './integrity/IntegrityManager'
import ApplicationManager from './ApplicationManager'
import { DesktopConfiguration, RegisterParams } from '@/shared/types'

import TestProfile from "@/main/profiles/priscillatest.json";
import Server from './Server'
import State from './State'
import ClientConfiguration from './ClientConfiguration'
import { EventEmitter } from 'stream'

export default class Client {
    emitter: EventEmitter = new EventEmitter();
    bridge = new Bridge(this);
    webProfileManager = new WebProfileManager(this);
    appManager =  new ApplicationManager(this);
    integrityManager = new IntegrityManager(this);
    server = new Server(this);
    state = new State(this);
    window!: BrowserWindow;
    configuration!: ClientConfiguration;

    errorHandler = (reason) => {
        if (reason instanceof Error) {
            this.bridge.send("Client-showError", reason.message);
            console.error(`Error: ${reason.message}`);
            console.error(reason.stack);
        }
    }

    isKiosk = false;

    constructor() {
        app.whenReady().then(() => this.init());

        app.on('window-all-closed', () => this.quit());
    }

    loadDesktop() {
        this.bridge.send('Client-loadDesktop', {
            apps: this.configuration.applications?.map((app) => ({
                name: app.name,
                start_open: app.start_open
            }))
        } as DesktopConfiguration);
    }

    init() {
        this.bridge.init();
        this.bridge.on('Client-devTest', () => {
            console.log("Starting dev test");
            this.configure("Priscilla Test Profile", TestProfile);
            this.loadDesktop();
        });

        this.bridge.on('Client-register', (params: RegisterParams) => {
            console.log(`Register: ${params.joinCode} ${params.name}`);
            this.server.start({url: params.url}).then(() => {
                this.server.joinRoom(params.joinCode, params.name).then((data) => {
                    this.state.setup();
                    this.configure(data.roomName, data.clientConfiguration);
                    this.loadDesktop();
                }).catch(this.errorHandler);
            }).catch(this.errorHandler);
        });

        electronApp.setAppUserModelId('ukf.priscillaclient')

        this.createWindow();
        
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        });

        app.on('before-quit', async (event) => {
            if (!this.state.state.disconnected) {
                event.preventDefault();
                this.state.disconnect().then(() => {
                    app.quit();
                });
            }
        });
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

    configure(roomName: string, options: ClientConfiguration) {
        this.configuration = options;
        this.window.title = `${roomName} - ${options.name}`;

        if (options.kiosk) {
            this.kiosk(true);
        }

        this.integrityManager.addModule(this.state);

        if (options.integrity) {
            this.integrityManager.configure(options.integrity);
        }

        if (options.webprofiles) {
            this.webProfileManager.configure(options.webprofiles);
        }

        if (options.applications) {
            this.appManager.configure(options.applications);
        }

        this.integrityManager.start();

    }

    kiosk(is: boolean = !this.isKiosk) {
        this.isKiosk = is;

        this.window.setKiosk(this.isKiosk);
        this.window.setAlwaysOnTop(this.isKiosk, "screen-saver");
        this.window.setFullScreenable(!this.isKiosk);
        this.window.setFullScreen(this.isKiosk);
        this.window.setMinimizable(!this.isKiosk);
        //this.window.setClosable(!this.isKiosk);
    }

    quit() {
        app.quit()
    }
};
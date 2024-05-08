import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Bridge from '@/Bridge'
import WebProfileManager from './web/WebProfileManager'
import IntegrityManager from './integrity/IntegrityManager'
import ApplicationManager from './web/ApplicationManager'
import { DesktopConfiguration, RegisterParams } from '@shared/types'

import TestProfile from "@/profiles/devtest.json";
import Server from '@/remote/Server'
import State from '@/State'
import { ClientConfiguration, LocalConfiguration } from '@/Configuration'
import { EventEmitter } from 'stream'
import IntegrityEvent, { Severity } from './integrity/IntegrityEvent'
import { readFileSync } from 'fs'

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
    localconfig: LocalConfiguration = {};

    errorHandler = (reason) => {
        if (reason instanceof Error) {
            this.bridge.send("Client-showError", reason.message);
            console.error(`Error: ${reason.message}`);
            console.error(reason.stack);
        }
    }

    isKiosk = false;

    constructor() {
        try {
            const data = readFileSync("localconfig.json", { flag: "r", encoding: "utf-8" });
            this.localconfig = JSON.parse(data);
        } catch (e) {}

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
        this.setupCommands();

        this.bridge.init();

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

        this.bridge.on('Client-ready', () => {
            this.bridge.send('Client-setConfig', {
                defaultServerURL: this.localconfig.defaultServerURL,
                language: this.localconfig.language,
                theme: this.localconfig.theme
            });
            if (this.localconfig.debug) {
                this.state.enableDebug();
            }
            this.bridge.send('Client-init');
        });

        electronApp.setAppUserModelId('ukf.priscillaclient')

        this.createWindow();

        
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        });

        app.on('before-quit', (event) => {
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
    
    setupDebug() {
        this.bridge.on('Debug-loadTestProfile', () => {
            console.log("Starting dev test");
            this.configure("DEBUG TEST PROFILE", TestProfile);
            this.loadDesktop();
        });

        this.bridge.on('Debug-unlock', () => {
            this.integrityManager.submitEvent(IntegrityEvent.create("Client-DEBUG", Severity.DEBUG_ACTION, "Unlocked Session"));
            this.state.unlock();
        });

        this.bridge.on('Debug-lock', () => {
            this.integrityManager.submitEvent(IntegrityEvent.create("Client-DEBUG", Severity.DEBUG_ACTION, "Locked Session"));
            this.state.lock();
        });

        this.bridge.on('Debug-kiosk', () => {
            this.integrityManager.submitEvent(IntegrityEvent.create("Client-DEBUG", Severity.DEBUG_ACTION, "Toggle Kiosk"));
            this.kiosk();
        });

        this.bridge.on('Debug-quit', () => {
            this.integrityManager.submitEvent(IntegrityEvent.create("Client-DEBUG", Severity.DEBUG_ACTION, "Quit"));
            this.quit();
        });
    }

    setupCommands() {
        this.emitter.on("Client-enableKiosk", () => this.kiosk(true));
        this.emitter.on("Client-disableKiosk", () => this.kiosk(false));
    }

    configure(roomName: string, options: ClientConfiguration) {
        this.configuration = options;
        this.window.title = `${roomName} - ${options.name}`;

        if (options.kiosk) {
            this.kiosk(true);
        }

        this.integrityManager.addModule(this.state);

        if (options.debug) {
            this.state.enableDebug();
        }

        if (options.integrity) {
            this.integrityManager.configure(options.integrity);
        }

        if (options.webprofiles) {
            this.webProfileManager.configure(options.webprofiles);
        }

        if (options.applications) {
            this.appManager.configure(options.applications);
        }

        if (options.event_flow) {
            for (const source of Object.keys(options.event_flow)) {
                for (const target of options.event_flow[source]) {
                    this.emitter.on(source, () => {
                        this.emitter.emit(target);
                    });
                }
            }
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
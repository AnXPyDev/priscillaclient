import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Bridge from '@/main/Bridge'
import { WebProfileConfiguration, WebProfileManager } from './web/WebProfile'
import IntegrityManager, { IntegrityConfiguration } from './integrity/IntegrityManager'
import { ApplicationConfiguration } from './web/Application'
import ApplicationManager from './ApplicationManager'
import { DesktopConfiguration, RegisterParams } from '@/shared/types'
import axios from 'axios';

export interface ClientConfiguration {
    name: string,
    integrity?: IntegrityConfiguration;
    webprofiles?: WebProfileConfiguration[];
    applications?: ApplicationConfiguration[];
};

import TestProfile from "@/main/profiles/priscillatest.json";
import Server from './Server'

export default class Client {
    bridge = new Bridge(this);
    webProfileManager = new WebProfileManager(this);
    appManager =  new ApplicationManager(this);
    integrityManager = new IntegrityManager(this);
    server = new Server(this);
    window!: BrowserWindow;
    configuration!: ClientConfiguration;

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
            this.configure(TestProfile);
            this.loadDesktop();
        });

        this.bridge.on('Client-register', (params: RegisterParams) => {
            console.log(`Register: ${params.url} ${params.code}`);
            this.server.configure({ url: params.url });
            this.server.start().then(() => {
                this.server.register(params.code).then((config) => {
                    this.configure(config);
                    this.loadDesktop();
                })
            });
        });

        electronApp.setAppUserModelId('ukf.priscillaclient')

        this.createWindow();
        
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        })
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

    configure(options: ClientConfiguration) {
        this.configuration = options;
        this.window.title = options.name;
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
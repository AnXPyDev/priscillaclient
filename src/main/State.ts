import Client from "./Client";
import IntegrityModule from "./integrity/IntegrityModule";
import { Severity } from "./integrity/IntegrityEvent";
import PushService from "./remote/PushService";

export default class State extends IntegrityModule {
    getName(): string { return "ClientState"; }
    start(): void {}
    stop(): void {}

    client: Client;
    pushservice!: PushService;

    state: {
        locked: boolean
        warning: boolean
        disconnected: boolean
        debug: boolean
        done: boolean
    } = {
        locked: false,
        warning: false,
        disconnected: false,
        debug: false,
        done: false

    };

    constructor(client: Client) {
        super();
        this.client = client;
    }

    lock() {
        this.state.locked = true;
        this.client.bridge.send('Client-lock');
        this.commit();
    }

    unlock() {
        this.state.locked = false;
        this.client.bridge.send('Client-unlock');
        this.commit();
    }

    setWarning() {
        this.state.warning = true;
        this.commit();
    }
    
    setDone() {
        this.state.done = true;
        this.commit();
    }

    clearWarning() {
        this.state.warning = false;
        this.commit();
    }

    enableDebug() {
        if (this.state.debug) {
            return;
        }
        this.state.debug = true;
        this.client.setupDebug();
        this.client.bridge.send('Client-enableDebug');
        this.commit();
    }

    async disconnect() {
        this.state.disconnected = true;
        await this.commit();
    }

    acknowledgeMessage(message: string) {
        this.submitEvent(Severity.MESSAGE_RECEIVED, message, {
            reason: "Message received"
        });
    }
    
    handlers: {
        [action: string]: () => void | undefined
    } = {
        "clear_warning": () => {
            this.clearWarning();
            this.acknowledgeMessage("Warning cleared");
        },
        "unlock": () => {
            this.unlock();
            this.acknowledgeMessage("Unlocked Session");
        },
        "lock": () => {
            this.lock();
            this.acknowledgeMessage("Locked Session");
        },
        "enable_debug": () => {
            this.enableDebug()
            this.acknowledgeMessage("Debug enabled");
        }
    };

    setup() {
        this.client.emitter.on("State-done", () => {
            this.setDone();
        });

        this.client.server.mailbox.handleMessage((data) => {
            const action = data['action'];
            if (action === undefined) {
                return;
            }

            const handler = this.handlers[action]
            if (handler === undefined) {
                return;
            }

            handler();
        });

        this.pushservice = this.client.server.pushservice;
    }

    commit() {
        this.pushservice.pushState(this.state);
    }
}

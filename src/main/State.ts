import { DesktopConfiguration } from "@shared/types";
import Client from "./Client";
import Server from "./remote/Server";
import IntegrityModule from "./integrity/IntegrityModule";
import { Severity } from "./integrity/IntegrityEvent";

export default class State extends IntegrityModule {
    getName(): string { return "ClientState"; }
    start(): void {}
    stop(): void {}

    client: Client;

    state: {
        locked: boolean
        warning: boolean
        disconnected: boolean
        debug: boolean
    } = {
        locked: false,
        warning: false,
        disconnected: false,
        debug: false
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

    clearWarning() {
        this.state.warning = false;
        this.commit();
    }

    enableDebug() {
        this.state.debug = true;
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

    setup() {
        this.client.server.mailbox.handleMessage((data) => {
            const action = data['action'];
            if (action === undefined) {
                return;
            }

            if (action == "clear_warning") {
                this.clearWarning();
                this.acknowledgeMessage("Warning cleared");
            }

            if (action == "unlock") {
                this.unlock();
                this.acknowledgeMessage("Unlocked Session");
            }

            if (action == "lock") {
                this.lock();
                this.acknowledgeMessage("Locked Session");
            }
        })
    }

    async commit() {
        await this.client.server.post("/client/pushstate", { state: JSON.stringify(this.state) });
    }
}
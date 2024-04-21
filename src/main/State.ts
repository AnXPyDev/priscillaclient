import { DesktopConfiguration } from "@/shared/types";
import Client from "./Client";
import Server from "./Server";
import IntegrityModule from "./integrity/IntegrityModule";
import { Severity } from "./integrity/IntegrityEvent";

export default class State extends IntegrityModule {
    getName(): string { return "ClientState"; }
    start(): void {}
    stop(): void {}

    client: Client;

    state: {
        locked: boolean
    } = {
        locked: false
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

    setup() {
        this.client.server.mailbox.handleMessage((data) => {
            const action = data['action'];
            if (action === undefined) {
                return;
            }

            if (action == "unlock") {
                this.unlock();
                this.submitEvent(Severity.SPECIAL_INFO, "Unlocked session", {
                    reason: "Message received"
                });
            }

            if (action == "lock") {
                this.lock();
                this.submitEvent(Severity.SPECIAL_INFO, "Locked session", {
                    reason: "Message received"
                });
            }
        })
    }

    async commit() {
        this.client.server.post("/client/pushstate", { state: JSON.stringify(this.state) });
    }
}
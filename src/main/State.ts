import Client from "./Client";
import Server from "./Server";

export default class State {
    client: Client;

    state: {
        locked: boolean
    } = {
        locked: false
    };

    constructor(client: Client) {
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
            }

            if (action == "lock") {
                this.lock();
            }
        })
    }

    async commit() {
        this.client.server.post("/client/pushstate", { state: JSON.stringify(this.state) });
    }
}
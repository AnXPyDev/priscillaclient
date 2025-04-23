import Mailbox, { MailboxConfiguration, Message } from "./Mailbox";
import Server from "./Server";

export default class RefreshMailbox extends Mailbox {
    server: Server;
    delay: number = 5000;
    running: boolean = false;
    
    /*
    pending: Map<number, {
        resolve: (value: any) => void,
        reject: (reason: any) => void
    }> = new Map();
    */

    messages: Message[] = [];
    last_message_id: number = -1;

    messageHandlers: ((data: object) => void)[] = [];

    
    constructor(server: Server, configuration: MailboxConfiguration) {
        super();
        this.server = server;
        this.delay = configuration.interval ?? this.delay;
    }
    
    /*
    async getResponse() {
        const requests = Array.from(this.pending.keys());
        let response: {
            [id: string]: string
        } = {};

        if (requests.length != 0) {
            const data = await this.server.post("/client/getresponse", { requests });
            response = data.response;
        }

        for (const sid in response) {
            const id = Number.parseInt(sid);
            const handler = this.pending.get(id);
            if (handler === undefined) {
                continue;
            }

            handler.resolve(JSON.parse(response[id]));
            this.pending.delete(id);
        }
    }
    */

    async getMessages() {
        const response = await this.server.post("/client/getmessages", {
            last_id: this.last_message_id
        });


        const messages: Message[] = response.messages!!;
        
        //console.log("getmessages", messages);

        if (messages.length == 0) {
            return;
        }

        this.last_message_id = messages[messages.length - 1].id;

        this.messages = this.messages.concat(messages);

        messages.forEach(message => {
            const data = JSON.parse(message.data);
            this.messageHandlers.forEach(handler => handler(data));
        });
    }

    async eventLoop() {
        await new Promise((resolve) => setTimeout(resolve, this.delay));
        while (this.running) {
            try {
                await this.getMessages();
            } catch(e) {
                console.error(e);
            }
            await new Promise((resolve) => setTimeout(resolve, this.delay));
        }

    }

    start() {
        this.running = true;
        this.eventLoop();
    }

    stop() {
        this.running = false;
    }

    handleMessage(handler: (data: object) => void) {
        this.messageHandlers.push(handler);
    }

}

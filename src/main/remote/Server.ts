import Client from "@/Client";
import Mailbox from "./Mailbox";
import RefreshMailbox from "./RefreshMailbox";
import { ClientConfiguration } from "@/Configuration";
import { createConnection, ConnectionConfiguration, Connection } from "./Connection";
import PushService, { RealtimePushService, UnifiedPushService } from "./PushService";

export interface ServerFeatures {
    supervisor: {
        protocol: "http" | "socket"
    }
    messages: {
        protocol: "http-long-polling" | "http-refresh" | "socket"
    }
    unifiedpush?: boolean
};

export default class Server {
    client: Client;
    connection!: Connection;
    features!: ServerFeatures;
    mailbox!: Mailbox;
    pushservice!: PushService;
    secret!: string;

    constructor(client: Client) {
        this.client = client;
    }

    async post(url: string, data: object = {}) {
        if (!this.connection) {
            return {code: 666};
        }

        const res = await this.connection.post(url, {secret: this.secret, ...data});
        if (res.data.code != 0) {
            throw new Error(res.data.message);
        }

        return res.data;
    }

    async start(config: ConnectionConfiguration) {
        this.connection = createConnection(config);
        this.features = await this.post("/info/features");
        this.setup();
    }

    setupSession(configuration: ClientConfiguration) {
        const req_proto = this.features.messages.protocol;
        const mailbox_config = configuration.mailbox ?? {};

        if (mailbox_config.type === "refresh" || mailbox_config.type === undefined) {
            if (req_proto !== "http-refresh") {
                throw new Error("Refresh mailbox requested by configuration but not supported by server");
            }
            this.mailbox = new RefreshMailbox(this, mailbox_config);
        } else {
            throw new Error(`Unsupported mailbox type ${mailbox_config.type}`)
        }

        const push_config = configuration.pushservice ?? {};

        if (push_config.type === "unified") {
            if (!this.features.unifiedpush) {
                throw new Error("Unifiedpush requested by configuration but not supported by server");
            }
            this.pushservice = new UnifiedPushService(this, push_config);
        } else if (push_config.type === "realtime" || push_config.type === undefined) {
            this.pushservice = new RealtimePushService(this, push_config);
        } else {
            throw new Error(`Unsupported pushservice type ${push_config.type}`);
        }

        this.mailbox.start();
        this.pushservice.start();
    }

    stop() {
        this.mailbox?.stop()
        this.pushservice?.stop()
    }

    setup() {
    }

    async joinRoom(joinCode: string, name: string): Promise<{
        clientConfiguration: ClientConfiguration,
        roomName: string
    }> {
        const res = await this.post("/client/joinroom", { joinCode, name });
        this.secret = res.secret;
        const config = JSON.parse(res.clientConfiguration);
        this.setupSession(config);
        return {
            clientConfiguration: config,
            roomName: res.roomName
        }
    }

};

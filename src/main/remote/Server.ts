import axios, { Axios } from "axios";
import Client from "@/Client";
import Mailbox from "./Mailbox";
import RefreshMailbox from "./RefreshMailbox";
import ClientConfiguration from "@/ClientConfiguration";

export interface ServerConfiguration {
    url: string
};

export interface ServerFeatures {
    supervisor: {
        protocol: "http" | "socket"
    }
    messages: {
        protocol: "http-long-polling" | "http-refresh" | "socket"
    }
};

export default class Server {
    client: Client;
    connection!: Axios;
    url!: string;
    features!: ServerFeatures;
    mailbox!: Mailbox;
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

    async start(config: ServerConfiguration): Promise<void> {
        this.url = config.url;

        console.log(this.url);

        this.connection = axios.create({
            baseURL: this.url,
        });

        this.features = await this.post("/info/features");

        this.setup();
    }

    setupSession() {
        this.mailbox.start();
    }

    setup() {
        const req_proto = this.features.messages.protocol;
        if (req_proto == "http-refresh") {
            this.mailbox = new RefreshMailbox(this);
        } else {
            throw new Error(`Unsupported requests protocol ${req_proto}`)
        }
    }

    async joinRoom(joinCode: string, name: string): Promise<{
        clientConfiguration: ClientConfiguration,
        roomName: string
    }> {
        const res = await this.post("/client/joinroom", { joinCode, name });
        this.secret = res.secret;
        this.setupSession();
        return {
            clientConfiguration: JSON.parse(res.clientConfiguration),
            roomName: res.roomName
        }
    }

};
import axios, { Axios } from "axios";
import Client, { ClientConfiguration } from "./Client";
import Mailbox from "./Mailbox";
import RefreshMailbox from "./RefreshMailbox";

export interface ServerConfiguration {
    url: string
};

export interface ServerFeatures {
    supervisor: {
        protocol: "http" | "socket"
    }
    requests: {
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

        this.mailbox.start();
    }

    async testMessage() {
        const res = await this.mailbox.send({data: {message: "hello world"}});
        console.log(JSON.stringify(res));
    }

    setup() {
        const req_proto = this.features.requests.protocol;
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
        return res;
    }

};
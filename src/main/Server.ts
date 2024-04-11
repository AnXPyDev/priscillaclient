import axios, { Axios } from "axios";
import Client, { ClientConfiguration } from "./Client";

export interface ServerConfiguration {
    url: string
};

export interface ServerFeatures {
    supervisor: {
        type: "http" | "socket",
    }
};

export default class Server {
    client: Client;
    connection!: Axios;
    url!: string;
    features: object = {};

    constructor(client: Client) {
        this.client = client;
    }

    async start(config: ServerConfiguration): Promise<void> {
        this.url = config.url;

        console.log(this.url);

        this.connection = axios.create({
            baseURL: this.url,
        });

        const res = await this.connection.post("/info/features");
        this.features = res.data;
    }

    async sendRequest() {
        const res = await this.connection.post("/client/request", {secret: this.client.secret, data: {message: "hello"}});
        console.log(JSON.stringify(res.data));
    }

    async joinRoom(joinCode: string, name: string): Promise<{
        clientConfiguration: ClientConfiguration,
        roomName: string,
        secret: string
    }> {
        const res = await this.connection.post("/client/joinroom", { joinCode, name });
        if (res.data.code != 0) {
            throw new Error(res.data.message);
        }
        return res.data;
    }

};
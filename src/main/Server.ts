import axios, { Axios } from "axios";
import Client, { ClientConfiguration } from "./Client";

export interface ServerConfiguration {
    url: string
};

export default class Server {
    client: Client;
    connection!: Axios;
    url: string = "http://localhost:3000";

    constructor(client: Client) {
        this.client = client;
    }

    async start(): Promise<void> {
        this.connection = axios.create({
            baseURL: this.url,
        });

        const res = await this.connection.post("/client/echo", { message: "Hello World!" });
        console.log(`Server echo: ${JSON.stringify(res.data)}`);
    }

    async joinRoom(joinCode: string, name: string): Promise<{
        clientConfiguration: ClientConfiguration,
        secret: string
    }> {
        const res = await this.connection.post("/client/joinRoom", { joinCode, name });
        if (res.data.code != 0) {
            throw new Error(res.data.message);
        }
        return res.data;
    }

};
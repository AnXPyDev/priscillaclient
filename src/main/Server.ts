import axios, { Axios } from "axios";
import Client, { ClientConfiguration } from "./Client";

export interface ServerConfiguration {
    url: string
};

export default class Server {
    client: Client;
    connection!: Axios;
    url!: string;

    constructor(client: Client) {
        this.client = client;
    }

    configure(options: ServerConfiguration) {
        this.url = options.url;
    }

    async start(): Promise<void> {
        this.connection = axios.create({
            baseURL: this.url,
        });

        const res = await this.connection.post("/client/echo", { message: "Hello World!" });
        console.log(`Server echo: ${JSON.stringify(res.data)}`);
    }

    async register(code: string): Promise<ClientConfiguration> {
        const res = await this.connection.post("/client/register", { code: code });
        return res.data.clientConfiguration as ClientConfiguration;
    }

};
import axios, { Axios } from "axios";

export interface ConnectionConfiguration {
    url: string
}

export interface Connection {
    post(endpoint: string, data?: object): Promise<any>
}

export class StandardConnection implements Connection {
    connection: Axios;
    constructor(url: string) {
        this.connection = axios.create({
            baseURL: url
        });
    }

    post(endpoint: string, data: object = {}) {
        return this.connection.post(endpoint, data);
    }

}

export class NoconfConnection implements Connection {
    connection: Axios;
    constructor(url: string) {
        this.connection = axios.create({
            baseURL: url
        });
    }

    post(endpoint: string, data: object = {}) {
        return this.connection.post(endpoint + ".php", data);
    }
}

export function createConnection(config: ConnectionConfiguration): Connection {
    if (config.url.startsWith("?")) {
        return new NoconfConnection(config.url.substring(1));
    } else {
        return new StandardConnection(config.url);
    }
}
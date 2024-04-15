export interface Message {
    id: number,
    data: string
}

export default abstract class Mailbox {
    abstract send(data: any): Promise<any>;
    abstract start(): void;
    abstract handleMessage(handler: (data: object) => void);
}
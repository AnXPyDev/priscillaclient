export interface Message {
    id: number,
    data: string
}

export default abstract class Mailbox {
    abstract start(): void;
    abstract handleMessage(handler: (data: object) => void);
}
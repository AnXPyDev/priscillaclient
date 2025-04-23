export interface Message {
    id: number,
    data: string
}

export interface MailboxConfiguration {
    type?: string,
    interval?: number
}

export default abstract class Mailbox {
    abstract start(): void;
    abstract stop(): void;
    abstract handleMessage(handler: (data: object) => void);
}

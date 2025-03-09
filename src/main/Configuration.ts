import { IntegrityConfiguration } from "@/integrity/IntegrityManager";
import { ApplicationConfiguration } from "@/web/Application";
import { MailboxConfiguration } from "./remote/Mailbox";
import { PushServiceConfiguration } from "./remote/PushService";

export interface ClientConfiguration {
    name?: string
    debug?: boolean
    kiosk?: boolean | {
        waitfor?: string
    }
    integrity?: IntegrityConfiguration
    webprofiles?: {
        [name: string]: object
    }
    applications?: ApplicationConfiguration[]
    event_flow?: {
        [source: string]: string[]
    }

    mailbox?: MailboxConfiguration
    pushservice?: PushServiceConfiguration
};

export interface LocalConfiguration {
    updateProviderURL?: string
    defaultServerURL?: string
    language?: string
    theme?: string
    debug?: boolean
    noupdate?: boolean
}

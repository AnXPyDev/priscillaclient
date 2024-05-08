import { IntegrityConfiguration } from "@/integrity/IntegrityManager";
import { ApplicationConfiguration } from "@/web/Application";

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
};

export interface LocalConfiguration {
    defaultServerURL?: string
    language?: string
    theme?: string
    debug?: boolean
}
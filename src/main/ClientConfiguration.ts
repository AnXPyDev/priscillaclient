import { IntegrityConfiguration } from "@/integrity/IntegrityManager";
import { ApplicationConfiguration } from "@/web/Application";

export default interface ClientConfiguration {
    name: string
    debug?: boolean
    kiosk?: boolean | {
        waitfor?: string
    }
    integrity?: IntegrityConfiguration
    webprofiles?: {
        [name: string]: object
    }
    applications?: ApplicationConfiguration[]
};

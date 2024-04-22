import { IntegrityConfiguration } from "./integrity/IntegrityManager";
import { ApplicationConfiguration } from "./web/Application";
import { WebProfileConfiguration } from "./web/WebProfile";

export default interface ClientConfiguration {
    name: string
    kiosk?: boolean
    integrity?: IntegrityConfiguration
    webprofiles?: {
        [name: string]: WebProfileConfiguration
    }
    applications?: ApplicationConfiguration[]
};

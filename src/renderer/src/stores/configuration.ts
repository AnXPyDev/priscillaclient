import { DesktopConfiguration } from "@shared/types";
import { defineStore } from "pinia";

interface State {
    desktopConfiguration: DesktopConfiguration;
}

export const useConfiguration = defineStore('configuration', {
    state: (): State => ({
        desktopConfiguration: {
            apps: []
        }
    })
});
import { Languages } from "@/lib/language";
import { DesktopConfiguration } from "@shared/types";
import { defineStore } from "pinia";

interface State {
    desktopConfiguration: DesktopConfiguration;
    language: Languages
}

export const useConfiguration = defineStore('configuration', {
    state: (): State => ({
        desktopConfiguration: {
            apps: []
        },
        language: Languages.ENGLISH
    })
});
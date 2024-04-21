import { Language } from "@/lib/language";
import type { Theme } from "@/lib/theme";
import { DesktopConfiguration } from "@shared/types";
import { defineStore } from "pinia";

interface State {
    desktopConfiguration: DesktopConfiguration;
    language: Language
    theme: Theme
}

export const useConfiguration = defineStore('configuration', {
    state: (): State => ({
        desktopConfiguration: {
            apps: []
        },
        language: Language.ENGLISH,
        theme: "light"
    })
});
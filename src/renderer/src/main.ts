import '@/styles/main.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia';

import { Theme, Themes, setTheme } from './lib/theme';

import App from '@/App.vue'

import router from '@/router'

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

import { useConfiguration } from './stores/configuration';
import { useState } from './stores/state';

const configuration = useConfiguration();
const state = useState();

(() => {
    setTheme(configuration.theme);

    let current_theme = configuration.theme;

    // @ts-expect-error
    configuration.$subscribe((mutation, state) => {
        if (state.theme != current_theme) {
            setTheme(state.theme);
            current_theme = state.theme;
        }
    })
})();

import { bridge } from './lib/Bridge';
import { DesktopConfiguration } from '@shared/types';
import { Language } from './lib/language';

bridge.on('Client-loadDesktop', (config: DesktopConfiguration) => {
    state.connected = true;
    configuration.desktopConfiguration = config; 
    router.push({ name: "desktop" });
});

bridge.on('Client-lock', () => {
    state.lockdown_mode = true;
    router.replace({ name: "lockdown" });
});

bridge.on('Client-unlock', () => {
    state.lockdown_mode = false;
    router.replace({ name: (state.connected ? "desktop" : "entry") });
})

bridge.on('Client-showError', (message: string) => {
    state.error = message;
});

bridge.on('Client-enableDebug', () => {
    state.debug = true;
})

interface Config {
    defaultServerURL?: string
    language?: string
    theme?: string
}

bridge.on('Client-setConfig', (config: Config) => {
    if (config.defaultServerURL) {
        configuration.defaultServerURL = config.defaultServerURL
    }
    if (config.language && Language[config.language]) {
        configuration.language = Language[config.language]
    }
    if (config.theme && Themes.includes(config.theme as Theme)) {
        configuration.theme = config.theme as Theme;
    }
});

bridge.on('Client-init', () => {
    app.mount('#app');
})

bridge.send('Client-ready');

router.afterEach((to) => {
    state.current_route = to.name?.toString()!!;
    console.log(state.current_route);
});

router.push({ name: "home" });



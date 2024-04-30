import '@/styles/main.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia';

import { setTheme } from './lib/theme';

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

router.afterEach((to) => {
    state.current_route = to.name?.toString()!!;
    console.log(state.current_route);
});

router.push({ name: "home" });


app.mount('#app');

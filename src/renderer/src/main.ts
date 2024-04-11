import '@/styles/main.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia';

import { setTheme } from './lib/theme';
setTheme();

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

import { bridge } from './lib/Bridge';
import { DesktopConfiguration } from '@shared/types';

bridge.on('Client-loadDesktop', (config: DesktopConfiguration) => {
    state.connected = true;
    configuration.desktopConfiguration = config; 
    router.push({ name: "desktop" });
});

router.afterEach((to) => {
    state.current_route = to.name?.toString()!!;
    console.log(state.current_route);
});


app.mount('#app');

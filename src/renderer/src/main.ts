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

app.mount('#app');

import { useConfiguration } from './stores/configuration';

const configuration = useConfiguration();

import { bridge } from './lib/Bridge';
import { DesktopConfiguration } from '@shared/types';

bridge.on('Client-loadDesktop', (config: DesktopConfiguration) => {
    configuration.desktopConfiguration = config; 
    router.push({ name: "desktop" });
});

import '@/styles/main.scss';

import { createApp } from 'vue'
import { setTheme } from './lib/theme';
setTheme();

import App from '@/App.vue'

import router from '@/router'

const app = createApp(App);

app.use(router);

app.mount('#app');


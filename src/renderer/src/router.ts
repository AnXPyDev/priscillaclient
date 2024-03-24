import { createRouter, createWebHistory } from 'vue-router';

import DesktopView from '@/views/DesktopView.vue';
import EntryView from './views/EntryView.vue';

export default createRouter({
    routes: [
        { name: "root", path: "/", redirect: "/entry" },
        { name: "entry", path: "/entry", component: EntryView },
        { name: "desktop", path: "/desktop", component: DesktopView }
    ],
    history: createWebHistory()
});
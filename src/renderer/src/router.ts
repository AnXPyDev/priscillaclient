import { createRouter, createWebHistory } from 'vue-router';

import DesktopView from '@/views/DesktopView.vue';
import EntryView from './views/EntryView.vue';
import SettingsView from './views/SettingsView.vue';
import LockdownView from './views/LockdownView.vue';

export default createRouter({
    routes: [
        { name: "home", path: "/", redirect: "/entry" },
        { name: "entry", path: "/entry", component: EntryView },
        { name: "desktop", path: "/desktop", component: DesktopView },
        { name: "settings", path: "/settings", component: SettingsView },
        { name: "lockdown", path: "/lockdown", component: LockdownView }
    ],
    history: createWebHistory()
});
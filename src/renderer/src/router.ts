import { createRouter, createWebHistory } from 'vue-router';

import DesktopView from '@/views/DesktopView.vue';

export default createRouter({
    routes: [
        { path: "/", redirect: "/index" },
        { name: "desktop", path: "/desktop", component: DesktopView }
    ],
    history: createWebHistory()
});
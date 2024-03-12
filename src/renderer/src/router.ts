import { createRouter, createWebHistory } from 'vue-router';

import MainView from '@/views/MainView.vue';

export default createRouter({
    routes: [
        { path: "/", component: MainView }
    ],
    history: createWebHistory()
});
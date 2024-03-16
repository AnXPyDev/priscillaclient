<script lang="ts" setup>

import ToolBar from '@/components/ToolBar.vue';
import Desktop, { DesktopBrowser, DesktopLayout } from '@/components/Desktop.vue';
import { computed, ref } from 'vue';
import { bridge } from '@/lib/Bridge';

const layout = ref<DesktopLayout>("layout-horizontal");

const browsers = ref<DesktopBrowser[]>([]);

const browser_config = {
    "priscilla1": { 
        active: true, profile: "priscilla"
    },
    "translator1": {
        active: true, profile: "translator"
    }
}

function compute_browsers() {
    const b: DesktopBrowser[] = [];
    for (const window in browser_config) {
        const config = browser_config[window];
        if (config.active) {
            b.push({
                id: window,
                profile: config.profile 
            });
        }
    }
    browsers.value = b;
}

compute_browsers();

function back() {
    bridge.send('Browser-back');
}

function forward() {
    bridge.send('Browser-forward');
}

function home() {
    bridge.send('Browser-home');
}

function quit() {
    bridge.send('Application-quit');
}

function kiosk() {
    bridge.send('Application-kiosk');
}

function toggleBrowser(id: string) {
    console.log(`toggle ${id}`);
    browser_config[id].active = !browser_config[id].active;
    compute_browsers();
}

</script>

<template>
    <div class="DesktopView">
        <ToolBar class="ToolBar">
            <button @click="home()">H</button>
            <button @click="back()"><</button>
            <button @click="forward()">></button>
            <button @click="kiosk()">K</button>
            <button @click="quit()">X</button>
            <button v-for="window in Object.keys(browser_config)" @click="toggleBrowser(window)">
                {{ window.substring(0, 2).toUpperCase() }}
            </button>
        </ToolBar>        
        <Desktop class="Desktop" :browsers="browsers" :layout="layout"></Desktop>
    </div>
</template>

<style lang="scss" scoped>
.DesktopView {
    display: flex;
    align-items: center;

    * {
        height: 100%;
    }

    .Desktop {
        flex-grow: 1;
    }
}
</style>
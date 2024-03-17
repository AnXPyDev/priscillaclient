<script lang="ts" setup>

import ToolBar from '@/components/ToolBar.vue';
import Desktop, { DesktopBrowser, DesktopLayout, DesktopLayouts } from '@/components/Desktop.vue';
import { computed, ref } from 'vue';
import { bridge } from '@/lib/Bridge';
import ToolBarButton from '@/components/ToolBarButton.vue';
import { currentTheme, rotateTheme, setTheme } from '@/lib/theme';


const browsers = ref<DesktopBrowser[]>([]);

let layout_index = 0;

const layout = ref<DesktopLayout>(DesktopLayouts[layout_index]);

const browser_config = {
    "priscilla1": { 
        active: true, profile: "priscilla", last_change: 0
    },
    "translator1": {
        active: true, profile: "translator", last_change: 1
    }
}

let counter = Object.keys(browser_config).length;

function compute_browsers() {
    const b: DesktopBrowser[] = [];
    for (const window in browser_config) {
        const config = browser_config[window];
        if (config.active) {
            b.push({
                id: window,
                profile: config.profile,
                // @ts-ignore
                index: config.last_change
            });
        }
    }

    // @ts-ignore
    b.sort((a, b) => a.index - b.index);
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
    counter++;
    browser_config[id].active = !browser_config[id].active;
    browser_config[id].last_change = counter;
    compute_browsers();
}

function rotateLayout() {
    layout_index = (layout_index + 1) % DesktopLayouts.length;
    layout.value = DesktopLayouts[layout_index];
}

import LayoutIcon from '@/assets/icons/layout-horizontal.svg';

</script>

<template>
    <div class="DesktopView">
        <ToolBar class="ToolBar">
            <ToolBarButton @click="home()">
                <i class="fa-solid fa-house"></i>
            </ToolBarButton>
            <ToolBarButton @click="back()">
                <i class="fa-solid fa-arrow-left"></i>
            </ToolBarButton>
            <ToolBarButton @click="forward()">
                <i class="fa-solid fa-arrow-right"></i>
            </ToolBarButton>
            <ToolBarButton @click="kiosk()">
                <i class="fa-solid fa-maximize"></i>
            </ToolBarButton>
            <ToolBarButton @click="rotateLayout()">
                <i class="fa-solid fa-chart-tree-map"></i>
            </ToolBarButton>
            <ToolBarButton @click="rotateTheme()">
                <i class="fa-solid fa-circle-half-stroke"></i>
            </ToolBarButton>
            <div class="spacing"></div>
            <ToolBarButton v-for="window in Object.keys(browser_config)" @click="toggleBrowser(window)">
                {{ window.substring(0, 2).toUpperCase() }}
            </ToolBarButton>
        </ToolBar>        
        <Desktop class="Desktop" :browsers="browsers" :layout="layout"></Desktop>
    </div>
</template>

<style lang="scss" scoped>
.DesktopView {
    display: flex;
    align-items: center;

    > * {
        height: 100%;
    }

    .ToolBar {
        > * {
            width: 100%;
        }

        .spacing {
            flex-grow: 99;
        }

    }

    .Desktop {
        flex-grow: 1;
    }
}
</style>
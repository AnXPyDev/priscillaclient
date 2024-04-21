<script lang="ts" setup>

import ToolBar from '@/components/ToolBar.vue';
import Desktop, { DesktopApp, DesktopLayout, DesktopLayouts } from '@/components/Desktop.vue';
import { ref } from 'vue';
import { bridge } from '@/lib/Bridge';
import Button from '@/components/Button.vue';
import { useConfiguration } from '@/stores/configuration';

const conf = useConfiguration();

const apps = ref<DesktopApp[]>([]);

let layout_index = 0;

const layout = ref<DesktopLayout>(DesktopLayouts[layout_index]);

const apps_config: { [key: string]: { active: boolean, last_change: number } } = {}

const app_names = ref<string[]>(conf.desktopConfiguration.apps.map((app) => app.name));

let counter = 0;
for (const app of conf.desktopConfiguration.apps) {
    apps_config[app.name] = {
        active: app.start_open,
        last_change: counter
    };
    counter++;
}

function compute_apps() {
    const b: DesktopApp[] = [];
    for (const app in apps_config) {
        const config = apps_config[app];
        if (config.active) {
            b.push({
                name: app,
                // @ts-ignore
                index: config.last_change
            });
        }
    }

    // @ts-ignore
    b.sort((a, b) => a.index - b.index);
    apps.value = b;
}

compute_apps();

function back() {
    bridge.send('Application-back');
}

function forward() {
    bridge.send('Application-forward');
}

function home() {
    bridge.send('Application-home');
}

//@ts-expect-error
function quit() {
    bridge.send('Client-quit');
}

function toggleApp(id: string) {
    console.log(`toggle ${id}`);
    counter++;
    apps_config[id].active = !apps_config[id].active;
    apps_config[id].last_change = counter;
    compute_apps();
}

function rotateLayout() {
    layout_index = (layout_index + 1) % DesktopLayouts.length;
    layout.value = DesktopLayouts[layout_index];
}

</script>

<template>
    <div class="DesktopView">
        <ToolBar class="ToolBar">
            <Button @click="home()">
                <i class="fa-solid fa-house"></i>
            </Button>
            <Button @click="back()">
                <i class="fa-solid fa-arrow-left"></i>
            </Button>
            <Button @click="forward()">
                <i class="fa-solid fa-arrow-right"></i>
            </Button>
            <Button @click="rotateLayout()">
                <i class="fa-solid fa-chart-tree-map"></i>
            </Button>
            <div class="spacing"></div>
            <Button v-for="app in app_names" @click="toggleApp(app)">
                {{ app.substring(0, 2).toUpperCase() }}
            </Button>
        </ToolBar>        
        <Desktop class="Desktop" :apps="apps" :layout="layout"></Desktop>
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
        height: 100%;
    }
}
</style>
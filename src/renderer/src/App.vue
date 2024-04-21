<script lang="ts" setup>

import { RouterView } from 'vue-router';
import ToolBar from './components/ToolBar.vue';
import LoadingIndicator from './components/LoadingIndicator.vue';
import String from './components/String.vue';
import { useState } from './stores/state';
import router from './router';
import ToolBarButton from './components/ToolBarButton.vue';
import { bridge } from './lib/Bridge';
import { rotateTheme } from './lib/theme';

const state = useState();

function goHome() {
    if (state.connected) {
        return router.replace({ name: "desktop" });
    }
    return router.replace({ name: "entry" });
}

function toggleSettings() {
    if (state.current_route == "settings") {
        return goHome();
    }

    return router.replace({ name: "settings" });
}

function lockSession() {
    bridge.send("Client-testLock");
}

function quit() {
    bridge.send("Client-quit");
}

</script>

<template>
    <div class="main">
        <RouterView class="RouterView"></RouterView>
        <ToolBar class="StatusBar" direction="horizontal">
            <LoadingIndicator v-if="state.loading > 0"/>
            <template v-if="!state.lockdown_mode">
                <ToolBarButton :active="state.current_route == 'settings'" @click="toggleSettings()">
                    <i class="fa-solid fa-gear"></i>
                </ToolBarButton>
                <ToolBarButton :active="state.current_route == 'lockdown'" @click="lockSession()">
                    <i class="fa-solid fa-lock-keyhole"></i>
                </ToolBarButton>
                <ToolBarButton @click="quit()">
                    <i class="fa-solid fa-xmark"></i>
                </ToolBarButton>
                <ToolBarButton @click="rotateTheme()">
                    <i class="fa-solid fa-circle-half-stroke"></i>
                </ToolBarButton>
            </template>
            <span>{{ state.current_route }}</span>
            <String name="lang_name"/>
        </ToolBar>
    </div>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .RouterView {
        height: 100%;
        flex-grow: 10;
    }

    .StatusBar {
        font-size: 0.8em;
    }
}
</style>

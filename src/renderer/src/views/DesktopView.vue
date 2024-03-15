<script lang="ts" setup>

import ToolBar from '@/components/ToolBar.vue';
import Desktop, { DesktopBrowser, DesktopLayout } from '@/components/Desktop.vue';
import { ref } from 'vue';

const layout = ref<DesktopLayout>("layout-horizontal");
const browsers = ref<DesktopBrowser[]>([]);

</script>

<template>
    <div class="MainView">
        <ToolBar class="ToolBar"></ToolBar>        
        <Desktop class="Desktop" :browsers="browsers" :layout="layout"></Desktop>
    </div>
</template>

<style lang="scss" scoped>
.MainView {
    display: flex;
    align-items: center;

    * {
        height: 100%;
    }

    .BrowserView {
        flex-grow: 1;
    }
}
</style>
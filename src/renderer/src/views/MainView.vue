<script lang="ts" setup>

import ToolBar from '@/components/ToolBar.vue';
import BrowserView from '@/components/BrowserView.vue';

</script>

<template>
    <div class="MainView">
        <ToolBar class="ToolBar"></ToolBar>        
        <BrowserView class="BrowserView"></BrowserView>
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
<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { BrowserView } from 'electron';

export type DesktopLayout = "layout-horizontal" | "layout-vertical";
export type DesktopBrowser = { id: string, profile: string };

const props = defineProps<{
    layout: DesktopLayout,
    browsers: DesktopBrowser[]
}>();

</script>

<template>
    <div class="Desktop" :class="layout">
        <BrowserView v-for="b in browsers" :id="b.id" :profile="b.profile" :key="b.id+b.profile" />
    </div>
</template>

<style lang="scss" scoped>
.Desktop {
    display: flex;

    &.layout-horizontal {
        flex-direction: row;
    }

    &.layout-vertical {
        flex-direction: column;
    }
}
</style>
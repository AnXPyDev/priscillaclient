<script lang="ts">
export const DesktopLayouts = [
    "layout-horizontal",
    "layout-focus-horizontal",
    "layout-vertical",
    "layout-focus-vertical"
] as const;

export type DesktopLayout = typeof DesktopLayouts[number];
export interface DesktopBrowser { id: string, profile: string };
</script>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import BrowserView from './BrowserView.vue';


const props = defineProps<{
    layout: DesktopLayout,
    browsers: DesktopBrowser[]
}>();

const others_class = computed<string>(() => {
    return props.browsers.length == 1 ? "empty" : "full"
})

</script>

<template>
    <div class="Desktop" :class="layout">
        <BrowserView class="BrowserView priority" v-for="b in browsers.slice(0, 1)" :id="b.id" :profile="b.profile" :key="b.id+b.profile" />
        <div class="others" :class="others_class">
            <BrowserView class="BrowserView secondary" v-for="b in browsers.slice(1)" :id="b.id" :profile="b.profile" :key="b.id+b.profile" />
        </div>
    </div>
</template>

<style lang="scss" scoped>

@use '@/styles/lib/dimens';

@mixin layout($direction, $ratio) {
    $flex_direction: row;
    $size_property: width;
    @if $direction == vertical {
        $flex_direction: column;
        $size_property: height;
    }

    flex-direction: $flex_direction;
    &:has(.others.full) {
        .BrowserView.priority {
            #{$size_property}: $ratio;
        }
    }

    .others.full {
        #{$size_property}: calc(100% - $ratio);
    }
}

.Desktop {
    display: flex;
    padding: dimens.$padding;
    gap: dimens.$padding;

    .BrowserView {
        width: 100%;
        height: 100%;
        box-shadow: 0 0 12px 0 var(--clr-shadow);
    }

    .others.empty {
        display: none;
    }

    &.layout-horizontal {
        @include layout(horizontal, 50%);
    }

    &.layout-focus-horizontal {
        @include layout(horizontal, 70%);
    }

    &.layout-vertical {
        @include layout(vertical, 50%);
    }
    
    &.layout-focus-vertical {
        @include layout(vertical, 70%);
    }
}
</style>
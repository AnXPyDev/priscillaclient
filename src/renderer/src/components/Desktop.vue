<script lang="ts">
export const DesktopLayouts = [
    "layout-horizontal",
    "layout-focus-horizontal",
    "layout-vertical",
    "layout-focus-vertical"
] as const;

export type DesktopLayout = typeof DesktopLayouts[number];
export interface DesktopApp { name: string };
</script>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import Application from './Application.vue';

const props = defineProps<{
    layout: DesktopLayout,
    apps: DesktopApp[]
}>();

const others_class = computed<string>(() => {
    return props.apps.length == 1 ? "empty" : "full"
})

</script>

<template>
    <div class="Desktop" :class="layout">
        <Application class="Application" v-for="app in apps.slice(0, 1)" :name="app.name" :key="app.name" />
        <div class="others" :class="others_class">
            <Application class="Application" v-for="app in apps.slice(1)" :name="app.name" :key="app.name" />
        </div>
    </div>
</template>

<style lang="scss" scoped>

@use '@/styles/lib/dimens';

@mixin layout($direction, $ratio) {
    $flex_direction: row;
    $other_flex_direction: column;
    $size_property: width;
    $other_size_property: height;
    @if $direction == vertical {
        $flex_direction: column;
        $other_flex_direction: row;
        $size_property: height;
        $other_size_property: width;
    }

    flex-direction: $flex_direction;
    &:has(.others.full) {
        > .Application {
            #{$size_property}: $ratio;
        }
    }

    .others.full {
        flex-direction: $other_flex_direction;
        #{$size_property}: calc(100% - $ratio);
    }
}

.Desktop {
    display: flex;
    padding: dimens.$padding;
    gap: dimens.$padding;

    .Application {
        width: 100%;
        height: 100%;
        flex-grow: 1;
        box-shadow: 0 0 12px 0 var(--clr-shadow);
    }

    .others {
        display: flex;
        gap: dimens.$padding;

        &.empty {
            display: none;
        }
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
<script setup lang="ts">

withDefaults(defineProps<{
    direction?: "horizontal" | "vertical"
}>(), {
    direction: "vertical"
});

</script>

<template>
    <div class="ToolBar" :class="direction">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/lib/dimens';

.ToolBar {
    background-color: var(--clr-bg-base);
    display: flex;
    padding: dimens.$padding;
    gap: dimens.$padding;

    align-items: center;

    &.horizontal {
        flex-direction: row;
    }

    &.vertical {
        flex-direction: column;
    }
}
</style>
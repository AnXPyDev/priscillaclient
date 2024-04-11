<script lang="ts" setup>
import { computed } from 'vue';



const props = withDefaults(defineProps<{
    active?: boolean
}>(), {
    active: false
});

const active_class = computed<string>(() => {
    return props.active ? "active" : "";
});

</script>

<template>
    <div class="component_ToolBarButton ToolBarButton" :class="active_class">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
@use "@/styles/lib/dimens";

.ToolBarButton {
    border-radius: dimens.$radius;
    padding: dimens.$padding-small;
    background-color: var(--clr-bg-1);

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: var(--clr-bg-hover-1);
        cursor: pointer;
    }

    &.active {
        background-color: var(--clr-bg-2);

        &:hover {
            background-color: var(--clr-bg-hover-2);
        }
    }

}

</style>

<style lang="scss">
.component_ToolBarButton {
    img {
        object-fit: contain;
        max-width: 100%;
        max-height: 100%;
        color: var(--clr-fg);
    }
}
</style>
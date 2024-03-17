<script lang="ts" setup>

</script>

<template>
    <div class="component_ToolBarButton ToolBarButton">
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
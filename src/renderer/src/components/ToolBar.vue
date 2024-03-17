<template>
    <div class="ToolBar">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.ToolBar {
    background-color: var(--clr-bg-base);
    width: 60px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 10px;
}
</style>
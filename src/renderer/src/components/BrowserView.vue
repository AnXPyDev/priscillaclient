<script lang="ts" setup>

import BrowserView from '@/lib/bridge/BrowserView';
import { ref, onMounted } from 'vue';

const region = ref<HTMLElement | null>(null) as any;

onMounted(() => {
    const view = new BrowserView("testid", region.value);
    view.attach();
    view.detach();
});

</script>

<template>
    <div class="BrowserView" ref="region">
        <h1>[Browser View]</h1>
    </div>
</template>

<style lang="scss" scoped>

.BrowserView {
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: white;
    color: black;
    border: 4px dashed black; 
}

</style>
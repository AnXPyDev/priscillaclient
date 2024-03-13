<script lang="ts" setup>

import BrowserView from '@/lib/bridge/BrowserView';
import Bridge from '@/lib/Bridge';
import { ref, onMounted } from 'vue';

const region = ref<HTMLElement | null>(null) as any;
const id = ref("testid");

onMounted(() => {
    const view = new BrowserView(new Bridge(true), id.value, region.value);
    view.attach();
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
<script lang="ts" setup>

import BrowserView from '@/lib/bridge/BrowserView';
import Bridge from '@/lib/Bridge';
import { ref, onMounted } from 'vue';

const props = defineProps<{
    id: string
    profile: string
}>();

const region = ref<HTMLElement | null>(null) as any;

onMounted(() => {
    const view = new BrowserView(new Bridge(true), props.id, region.value);
    view.create(props.profile);
    view.attach();
});

</script>

<template>
    <div class="BrowserView" ref="region">
        <h1>Browser View [{{ props.id }}]</h1>
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
<script lang="ts" setup>

import BrowserView from '@/lib/bridge/BrowserView';
import { ref, onMounted } from 'vue';
import { bridge } from '@/lib/Bridge';

const props = defineProps<{
    id: string
    profile: string
}>();

const region = ref<HTMLElement | null>(null) as any;

onMounted(() => {
    const view = new BrowserView(bridge, props.id, region.value);
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
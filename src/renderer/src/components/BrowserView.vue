<script lang="ts" setup>

import BrowserView from '@/lib/bridge/BrowserView';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { bridge } from '@/lib/Bridge';

const props = defineProps<{
    id: string
    profile: string
}>();

const region = ref<HTMLElement | null>(null) as any;

const view = new BrowserView(bridge, props.id, props.profile);

onMounted(async () => {
    await nextTick();
    view.attach(region.value);
});

onUnmounted(() => {
    view.detach();
});

</script>

<template>
    <div class="BrowserView">
        <div class="inner" ref="region">
            <h1>Browser View [{{ props.id }}]</h1>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.BrowserView {
    .inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    background-color: var(--clr-bg-1);
    color: var(--clr-fg);
}

</style>
<script lang="ts" setup>

import Application from '@/lib/bridge/Application';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { bridge } from '@/lib/Bridge';

const props = defineProps<{
    name: string
}>();

const region = ref<HTMLElement | null>(null) as any;

const view = new Application(bridge, props.name);

onMounted(async () => {
    await nextTick();
    view.attach(region.value);
});

onUnmounted(() => {
    view.detach();
});

</script>

<template>
    <div class="Application">
        <div class="inner" ref="region">
            <!--<h1>Browser View [{{ props.id }}]</h1>-->
        </div>
    </div>
</template>

<style lang="scss" scoped>

.Application {
    .inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: #FFFFFF;
    }

    background-color: var(--clr-bg-1);
    color: var(--clr-fg);
}

</style>
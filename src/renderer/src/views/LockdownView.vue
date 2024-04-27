<script setup lang="ts">
import Button from '@/components/Button.vue';
import String from '@/components/String.vue';
import { bridge } from '@/lib/Bridge';
import { useState } from '@/stores/state';
const state = useState();

function unlock() {
    bridge.send('Debug-unlock');
}

</script>

<template>
    <div class="container">
        <i class="icon fa-solid fa-lock-keyhole"></i>
        <span class="message">
            <String name="lockdown_message"/>
        </span>
        <Button v-if="state.debug" @click="unlock()">
            <i class="fa-solid fa-lock-open"></i>
        </Button>
    </div>
</template>

<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1em;

        .icon {
            font-size: 5em;
        }

        span {
            max-width: 30%;
            text-align: center;
        }
    }
</style>
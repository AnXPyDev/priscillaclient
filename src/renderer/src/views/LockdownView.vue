<script setup lang="ts">
import String from '@/components/String.vue';
</script>

<template>
    <div class="container">
        <i class="icon fa-solid fa-lock-keyhole"></i>
        <span class="message">
            <String name="lockdown_message"/>
        </span>
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
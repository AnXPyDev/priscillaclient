<script lang="ts" setup>

import { bridge } from '@/lib/Bridge';

function back() {
    bridge.send('Browser-back');
}

function forward() {
    bridge.send('Browser-forward');
}

function home() {
    bridge.send('Browser-home');
}

function quit() {
    bridge.send('Application-quit');
}

function kiosk() {
    bridge.send('Application-kiosk');
}

</script>

<template>
    <div class="ToolBar">
        <button @click="home()">H</button>
        <button @click="back()"><</button>
        <button @click="forward()">></button>
        <button @click="kiosk()">K</button>
        <button @click="quit()">X</button>
    </div>
</template>

<style lang="scss" scoped>
.ToolBar {
    background-color: #404040;
    width: 60px;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
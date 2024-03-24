<script lang="ts" setup>
import { bridge } from '@/lib/Bridge';
import { ref } from 'vue';
import { RegisterParams } from '@shared/types';


function devTest() {
    bridge.send('Client-devTest');
}

const accessCode = ref<string>("000000");
const url = ref<string>("http://localhost:3000");

function connect() {
    bridge.send('Client-register', {
        code: accessCode.value,
        url: url.value
    } as RegisterParams);
}

</script>

<template>
    <h1>entry</h1>
    <button @click="devTest()">TestPriscilla</button>
    code
    <input v-model="accessCode"></input>
    url
    <input v-model="url"></input>
    <button @click="connect()">Connect</button>

</template>
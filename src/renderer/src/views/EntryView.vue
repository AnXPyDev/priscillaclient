<script lang="ts" setup>
import { bridge } from '@/lib/Bridge';
import { ref } from 'vue';
import { RegisterParams } from '@shared/types';


function devTest() {
    bridge.send('Client-devTest');
}


const error = ref<string>("");

bridge.on('Client-showError', (message: string) => {
    error.value = message;
});

const joinCode = ref<string>("000000");
const name = ref<string>("Meno");

function connect() {
    bridge.send('Client-register', {
        joinCode: joinCode.value,
        name: name.value
    } as RegisterParams);
}

</script>

<template>
    <h1>entry</h1>
    <button @click="devTest()">TestPriscilla</button>
    code
    <input v-model="joinCode"></input>
    name
    <input v-model="name"></input>
    <button @click="connect()">Connect</button>

    <p class="error">{{ error }}</p>
</template>

<style lang="scss" scoped>
    .error {
        color: red;
    }
</style>
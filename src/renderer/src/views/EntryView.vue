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
const url = ref<string>("http://localhost/supervisor");

function connect() {
    bridge.send('Client-register', {
        joinCode: joinCode.value,
        name: name.value,
        url: url.value
    } as RegisterParams);
}

console.log("JKLFJLAKFJKAL");

</script>

<template>
    <div class="container">
        <h1>entry</h1>
        <button @click="devTest()">TestPriscilla</button>
        url
        <input v-model="url"></input>
        code
        <input v-model="joinCode"></input>
        name
        <input v-model="name"></input>
        <button @click="connect()">Connect</button>
        <p class="error">{{ error }}</p>
    </div>
</template>

<style lang="scss" scoped>
    .error {
        color: red;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: start;
    }
</style>
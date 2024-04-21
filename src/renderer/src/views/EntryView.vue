<script lang="ts" setup>
import { bridge } from '@/lib/Bridge';
import { ref } from 'vue';
import { RegisterParams } from '@shared/types';
import String from '@/components/String.vue';
import Button from '@/components/Button.vue';

function devTest() {
    bridge.send('Client-devTest');
}

const joinCode = ref<string>("");
const name = ref<string>("");
const url = ref<string>("");

const inputErrors = ref({
    url: false,
    joinCode: false,
    name: false
});



function connect() {
    if (url.value.length == 0) {
        inputErrors.value.url = true;
    } else {
        inputErrors.value.url = false;
    }
    if (joinCode.value.length == 0) {
        inputErrors.value.joinCode = true;
    } else {
        inputErrors.value.joinCode = false;
    }
    if (name.value.length == 0) {
        inputErrors.value.name = true;
    } else {
        inputErrors.value.name = false;
    }

    if (Object.values(inputErrors.value).includes(true)) {
        return;
    }

    bridge.send('Client-register', {
        joinCode: joinCode.value,
        name: name.value,
        url: url.value
    } as RegisterParams);
}

</script>

<template>
    <div class="EntryView">
        <span class="title"><String name="entry_title"/>&nbsp;&nbsp;<i class="fa-solid fa-wifi"></i></span>
        <div class="split">
            <div class="left">
                <div>
                    <span><String name="entry_url_label"/></span>
                </div>
                <div>
                    <span><String name="entry_join_code_label"/></span>
                </div>
                <div>
                    <span><String name="entry_name_label"/></span>
                </div>
            </div>
            <div class="right">
                <div>
                    <input :class="inputErrors.url && 'error'" v-model="url"></input>
                </div>
                <div>
                    <input :class="inputErrors.joinCode && 'error'" v-model="joinCode"></input>
                </div>
                <div>
                    <input :class="inputErrors.name && 'error'" v-model="name"></input>
                </div>
            </div>
        </div>
        <Button @click="connect()"><String name="entry_button_connect_label"/></Button>
        <Button @click="devTest()">Dev Test</Button>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/lib/dimens';
.EntryView {
    $padding: dimens.$padding; 

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: $padding;

    > .title {
        font-weight: 700;
        font-size: 1.4em;

    }

    > .split {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        
        > div {
            display: flex;
            flex-direction: column;
            gap: $padding;

            > div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 2em;
            }
        }

        $split_gap: calc($padding * 2);

        > .left {
            min-width: 45%;
            align-items: end;
            padding-right: calc($split_gap / 2);
            color: rgba(var(--clr-fg), 0.5);
        }
        > .right {
            width: 100%;
            align-items: start;
            padding-left: calc($split_gap / 2);
        }
    }
    
    input {
        width: 20em;
        padding: $padding;

        outline: var(--clr-fg) solid 1.5px;
        border-radius: 5px;
        border: none;
        background-color: var(--clr-bg-1);
        color: var(--clr-fg);

        &.error {
            outline-color: var(--clr-fg-error);
        }
    }
}
</style>
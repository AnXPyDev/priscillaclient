<script setup lang="ts">

import { Language, getString } from '@/lib/language';
import { useConfiguration } from '@/stores/configuration';
import { computed } from 'vue';

const configuration = useConfiguration();

const props = defineProps<{
    name: string
    language?: Language
}>()

const value = computed(() => {
    return getString(props.name, props.language ?? configuration.language);
});

</script>

<template>
    <span>{{ value }}</span>
</template>
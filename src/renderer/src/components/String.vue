<script setup lang="ts">

import { getString } from '@/lib/language';
import { useConfiguration } from '@/stores/configuration';
import { computed } from 'vue';

const configuration = useConfiguration();

const props = defineProps<{
    name: string
}>()

const value = computed(() => {
    return getString(props.name, configuration.language);
});

</script>

<template>
    <span>{{ value }}</span>
</template>
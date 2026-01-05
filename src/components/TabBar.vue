<script setup lang="ts">
import { messages } from '../messages.fr'
import { TAB_NAMES } from '../tabs'
import type { TabName } from '../tabs'

defineProps<{ modelValue: TabName }>()
const emit = defineEmits<{ 'update:modelValue': [tab: TabName] }>()
</script>

<template>
  <nav class="tab-bar" aria-label="Navigation principale">
    <button
      v-for="tab in TAB_NAMES"
      :key="tab"
      type="button"
      class="tab-bar__item"
      :class="{ 'tab-bar__item--active': tab === modelValue }"
      :aria-current="tab === modelValue ? 'page' : undefined"
      @click="emit('update:modelValue', tab)"
    >
      {{ messages.tabs[tab] }}
    </button>
  </nav>
</template>


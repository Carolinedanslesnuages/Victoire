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

<style scoped>
.tab-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}


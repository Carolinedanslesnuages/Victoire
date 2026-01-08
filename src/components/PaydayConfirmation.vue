<script setup lang="ts">
import { ref } from 'vue'
import type { IsoDate } from '../domain/types'
import { formatDayMonth } from '../format'
import { messages } from '../messages.fr'

const props = defineProps<{ nominalDate: IsoDate; today: IsoDate }>()
const emit = defineEmits<{ confirm: [date: IsoDate] }>()

const chosenDate = ref<IsoDate>(props.today)
</script>

<template>
  <section class="card payday" aria-live="polite">
    <h2>{{ messages.payday.title }}</h2>
    <p>{{ messages.payday.question(formatDayMonth(nominalDate)) }}</p>
    <label class="field">
      <span class="field__label">{{ messages.payday.dateLabel }}</span>
      <input v-model="chosenDate" class="field__input" type="date" name="paydayDate" :max="today" />
    </label>
    <button type="button" class="button" @click="emit('confirm', chosenDate)">
      {{ messages.payday.confirm }}
    </button>
  </section>
</template>

<style scoped>
.payday {
  border-color: var(--color-primary);
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { gaugeFillRatio } from '../domain/allowance'
import { formatEuros } from '../domain/money'
import type { DayStatus } from '../domain/types'
import { messages } from '../messages.fr'

const props = defineProps<{ status: DayStatus }>()

const fillPercent = computed(() => Math.round(gaugeFillRatio(props.status) * 100))

const levelMessage = computed(() => {
  if (props.status.level === 'over' && props.status.budgetTodayCents <= 0) {
    return messages.today.exhausted
  }
  return messages.today[props.status.level]
})
</script>

<template>
  <section class="gauge" :class="`gauge--${status.level}`" aria-live="polite">
    <p class="gauge__label">{{ messages.today.remainingLabel }}</p>
    <p class="gauge__amount">{{ formatEuros(status.remainingTodayCents) }}</p>

    <div
      class="gauge__track"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="fillPercent"
      :aria-label="messages.today.remainingLabel"
    >
      <div class="gauge__fill" :style="{ width: `${fillPercent}%` }"></div>
    </div>
    <p class="gauge__message">{{ levelMessage }}</p>

    <dl class="gauge__details">
      <div>
        <dt>{{ messages.today.budgetLabel }}</dt>
        <dd>{{ formatEuros(status.budgetTodayCents) }}</dd>
      </div>
      <div>
        <dt>{{ messages.today.spentLabel }}</dt>
        <dd>{{ formatEuros(status.spentTodayCents) }}</dd>
      </div>
      <div>
        <dt>{{ messages.today.cycleLabel }}</dt>
        <dd>{{ formatEuros(status.remainingCycleCents) }}</dd>
      </div>
    </dl>
    <p class="gauge__days">{{ messages.today.daysLeft(status.daysLeft) }}</p>
  </section>
</template>


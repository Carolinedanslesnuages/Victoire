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

<style scoped>
.gauge {
  margin-bottom: var(--space-medium);
  padding: var(--space-large) var(--space-medium);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  text-align: center;
}

.gauge__label {
  margin: 0;
  color: var(--color-muted);
}

.gauge__amount {
  margin: 0;
  font-size: var(--font-size-big);
  font-weight: 700;
  line-height: 1.1;
}

.gauge__track {
  height: 0.75rem;
  margin: var(--space-medium) 0;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-border);
}

.gauge__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--color-comfortable);
  transition: width 0.3s ease;
}

.gauge--close .gauge__fill {
  background: var(--color-close);
}

.gauge--over .gauge__fill {
  background: var(--color-over);
}

.gauge--close .gauge__amount {
  color: var(--color-close);
}

.gauge--over .gauge__amount {
  color: var(--color-over);
}


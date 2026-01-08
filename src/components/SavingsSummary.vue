<script setup lang="ts">
import { formatEuros } from '../domain/money'
import { messages } from '../messages.fr'

defineProps<{ totalCents: number; cycles: number }>()
</script>

<template>
  <section class="card savings">
    <p class="savings__title">{{ messages.savings.title }}</p>
    <p class="savings__amount">{{ formatEuros(totalCents) }}</p>
    <p class="savings__detail">{{ messages.savings.detail(cycles) }}</p>
  </section>
</template>

<style scoped>
.savings {
  text-align: center;
}

.savings__title,
.savings__detail {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.savings__amount {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.75rem;
  font-weight: 700;
}
</style>

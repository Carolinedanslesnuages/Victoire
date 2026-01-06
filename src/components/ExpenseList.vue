<script setup lang="ts">
import { computed } from 'vue'
import { totalOf } from '../domain/allowance'
import { formatEuros } from '../domain/money'
import type { Expense } from '../domain/types'
import { formatLongDate } from '../format'
import { messages } from '../messages.fr'

const props = defineProps<{ expenses: Expense[] }>()
const emit = defineEmits<{ remove: [identifier: string] }>()

const groups = computed(() => {
  const byDate = new Map<string, Expense[]>()
  for (const expense of props.expenses) {
    byDate.set(expense.date, [...(byDate.get(expense.date) ?? []), expense])
  }
  return [...byDate.entries()].map(([date, items]) => ({ date, items, total: totalOf(items) }))
})
</script>

<template>
  <section>
    <h2>{{ messages.history.title }}</h2>
    <p v-if="groups.length === 0" class="expense-list__empty">{{ messages.history.empty }}</p>

    <article v-for="group in groups" :key="group.date" class="card">
      <header class="expense-list__header">
        <h3 class="expense-list__date">{{ formatLongDate(group.date) }}</h3>
        <span class="expense-list__total">
          {{ messages.history.dayTotal(formatEuros(group.total)) }}
        </span>
      </header>

      <ul class="expense-list__items">
        <li v-for="item in group.items" :key="item.identifier" class="expense-list__item">
          <span>{{ item.label || messages.history.noLabel }}</span>
          <span class="expense-list__amount">{{ formatEuros(item.amountCents) }}</span>

          <button
            type="button"
            class="expense-list__remove"
            :aria-label="
              messages.history.removeAria(
                item.label || messages.history.noLabel,
                formatEuros(item.amountCents),
              )
            "
            @click="emit('remove', item.identifier)"
          >
            {{ messages.history.remove }}
          </button>
        </li>
      </ul>
    </article>
  </section>
</template>

<style scoped>
.expense-list__empty {
  color: var(--color-muted);
}

.expense-list__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-small);
}

.expense-list__date {
  margin: 0;
  font-size: 1rem;
  text-transform: capitalize;
}


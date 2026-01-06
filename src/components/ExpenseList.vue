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


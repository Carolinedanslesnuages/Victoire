<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { totalOf } from '../domain/allowance'
import { formatEditableEuros, formatEuros } from '../domain/money'
import type { Expense, IsoDate } from '../domain/types'
import { formatLongDate } from '../format'
import { messages } from '../messages.fr'
import type { AddExpenseResult, ExpenseFields } from '../state/app-state'

const props = defineProps<{
  expenses: Expense[]
  today: IsoDate
  cycleStart: IsoDate
  update: (identifier: string, fields: ExpenseFields) => AddExpenseResult
}>()
const emit = defineEmits<{ remove: [identifier: string] }>()

const groups = computed(() => {
  const byDate = new Map<string, Expense[]>()
  for (const expense of props.expenses) {
    byDate.set(expense.date, [...(byDate.get(expense.date) ?? []), expense])
  }
  return [...byDate.entries()].map(([date, items]) => ({ date, items, total: totalOf(items) }))
})

const editing = ref<string | null>(null)
const draft = reactive<ExpenseFields>({ amountText: '', label: '', date: '' })
const errorText = ref('')

function startEdit(expense: Expense): void {
  editing.value = expense.identifier
  draft.amountText = formatEditableEuros(expense.amountCents)
  draft.label = expense.label
  draft.date = expense.date
  errorText.value = ''
}

function cancelEdit(): void {
  editing.value = null
  errorText.value = ''
}

function saveEdit(): void {
  if (editing.value === null) {
    return
  }
  const result = props.update(editing.value, { ...draft })
  if (result.ok) {
    cancelEdit()
    return
  }
  errorText.value = messages.addExpense[result.reason]
}
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
          <form
            v-if="editing === item.identifier"
            class="expense-list__edit"
            novalidate
            @submit.prevent="saveEdit"
          >
            <input
              v-model="draft.amountText"
              class="field__input"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              name="amount"
              :aria-label="messages.addExpense.amountLabel"
            />
            <input
              v-model="draft.label"
              class="field__input"
              type="text"
              autocomplete="off"
              name="label"
              :aria-label="messages.addExpense.labelLabel"
            />
            <input
              v-model="draft.date"
              class="field__input"
              type="date"
              name="date"
              :min="cycleStart"
              :max="today"
              :aria-label="messages.addExpense.dateLabel"
            />
            <p v-if="errorText" class="expense-list__error" role="alert">{{ errorText }}</p>
            <div class="expense-list__edit-actions">
              <button type="submit" class="button">{{ messages.history.save }}</button>
              <button type="button" class="button button--quiet" @click="cancelEdit">
                {{ messages.history.cancel }}
              </button>
            </div>
          </form>

          <template v-else>
            <span>{{ item.label || messages.history.noLabel }}</span>
            <span class="expense-list__amount">{{ formatEuros(item.amountCents) }}</span>
            <button
              type="button"
              class="expense-list__action expense-list__edit-button"
              :aria-label="
                messages.history.editAria(
                  item.label || messages.history.noLabel,
                  formatEuros(item.amountCents),
                )
              "
              @click="startEdit(item)"
            >
              {{ messages.history.edit }}
            </button>
            <button
              type="button"
              class="expense-list__action expense-list__remove"
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
          </template>
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

.expense-list__total {
  color: var(--color-muted);
  font-size: 0.875rem;
}

.expense-list__items {
  margin: 0;
  padding: 0;
  list-style: none;
}

.expense-list__item {
  display: flex;
  align-items: center;
  gap: var(--space-small);
  padding: 0.35rem 0;
}

.expense-list__item > :first-child {
  flex: 1;
}

.expense-list__amount {
  font-weight: 600;
}

.expense-list__action {
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

.expense-list__remove {
  color: var(--color-over);
}

.expense-list__edit {
  display: grid;
  gap: var(--space-small);
}

.expense-list__edit-actions {
  display: flex;
  gap: var(--space-small);
}

.expense-list__error {
  margin: 0;
  color: var(--color-over);
}
</style>

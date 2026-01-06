<script setup lang="ts">
import { ref } from 'vue'
import { messages } from '../messages.fr'
import type { AddExpenseResult } from '../state/app-state'

const props = defineProps<{ submit: (amountText: string, label: string) => AddExpenseResult }>()

const amount = ref('')
const label = ref('')
const errorText = ref('')
const amountInput = ref<HTMLInputElement | null>(null)

function handleSubmit(): void {
  const result = props.submit(amount.value, label.value)
  if (result.ok) {
    amount.value = ''
    label.value = ''
    errorText.value = ''
    amountInput.value?.focus()
    return
  }

  errorText.value =
    result.reason === 'zeroAmount'
      ? messages.addExpense.zeroAmount
      : messages.addExpense.invalidAmount
}
</script>

<template>
  <form class="card" novalidate @submit.prevent="handleSubmit">
    <h2>{{ messages.addExpense.title }}</h2>
    <label class="field">
      <span class="field__label">{{ messages.addExpense.amountLabel }}</span>
      <input
        ref="amountInput"
        v-model="amount"
        class="field__input"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        name="amount"
        :placeholder="messages.addExpense.amountPlaceholder"
      />
    </label>

    <label class="field">
      <span class="field__label">{{ messages.addExpense.labelLabel }}</span>
      <input
        v-model="label"
        class="field__input"
        type="text"
        autocomplete="off"
        name="label"
        :placeholder="messages.addExpense.labelPlaceholder"
      />
    </label>

    <p v-if="errorText" class="expense-form__error" role="alert">{{ errorText }}</p>
    <button type="submit" class="button">{{ messages.addExpense.submit }}</button>
  </form>
</template>


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


<script setup lang="ts">
import { formatEuros } from '../domain/money'
import type { ClosingDecision, ClosingProposal } from '../domain/types'
import { formatDayMonth } from '../format'
import { messages } from '../messages.fr'

defineProps<{ proposal: ClosingProposal }>()
const emit = defineEmits<{ decide: [decision: ClosingDecision] }>()
</script>

<template>
  <section class="card closing" aria-live="polite">
    <h2>{{ messages.closing.title }}</h2>
    <p>
      {{
        messages.closing.summary(
          formatDayMonth(proposal.startDate),
          formatDayMonth(proposal.endDate),
          formatEuros(proposal.leftoverCents),
        )
      }}
    </p>

    <div class="closing__actions">
      <button type="button" class="button" @click="emit('decide', 'saved')">
        {{ messages.closing.saved }}
      </button>
      <button type="button" class="button button--quiet" @click="emit('decide', 'ignored')">
        {{ messages.closing.ignored }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.closing {
  border-color: var(--color-primary);
}

.closing__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-small);
}
</style>

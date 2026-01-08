<script setup lang="ts">
import { formatEuros } from '../domain/money'
import type { CycleReview } from '../domain/review'
import { formatDayMonth } from '../format'
import { messages } from '../messages.fr'

defineProps<{ reviews: CycleReview[] }>()

function decisionText(review: CycleReview): string {
  if (review.decision === 'saved') {
    return messages.review.decisionSaved
  }
  return review.decision === 'ignored' ? messages.review.decisionIgnored : ''
}
</script>

<template>
  <section v-if="reviews.length > 0">
    <h2>{{ messages.review.title }}</h2>
    <article v-for="review in reviews" :key="review.start" class="card review">
      <h3 class="review__period">
        {{ messages.review.period(formatDayMonth(review.start), formatDayMonth(review.end)) }}
      </h3>
      <p class="review__line">
        {{ messages.review.spent(formatEuros(review.spentCents), formatEuros(review.potCents)) }}
      </p>
      <p class="review__line" :class="{ 'review__line--over': review.leftoverCents < 0 }">
        {{
          review.leftoverCents < 0
            ? messages.review.overshoot(formatEuros(-review.leftoverCents))
            : messages.review.leftover(formatEuros(review.leftoverCents))
        }}
      </p>
      <p class="review__line">{{ messages.review.overspentDays(review.overspentDays) }}</p>
      <p v-if="decisionText(review)" class="review__line">{{ decisionText(review) }}</p>
      <p class="review__saved">{{ messages.review.saved(formatEuros(review.savedCents)) }}</p>
    </article>
  </section>
</template>

<style scoped>
.review__period {
  margin: 0 0 var(--space-small);
  font-size: 1rem;
}

.review__line {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.review__line--over {
  color: var(--color-over);
}

.review__saved {
  margin: var(--space-small) 0 0;
  font-weight: 600;
}
</style>

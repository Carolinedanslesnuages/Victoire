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


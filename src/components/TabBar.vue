<script setup lang="ts">
import { messages } from '../messages.fr'
import { TAB_NAMES } from '../tabs'
import type { TabName } from '../tabs'

defineProps<{ modelValue: TabName }>()
const emit = defineEmits<{ 'update:modelValue': [tab: TabName] }>()
</script>


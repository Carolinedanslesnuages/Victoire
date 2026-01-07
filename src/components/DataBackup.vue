<script setup lang="ts">
import { ref } from 'vue'
import { messages } from '../messages.fr'
import type { ImportResult } from '../state/app-state'

const props = defineProps<{
  exportBackup: () => string
  importBackup: (text: string) => ImportResult
}>()

const feedback = ref('')

function downloadBackup(): void {
  const blob = new Blob([props.exportBackup()], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = messages.backup.exportedName
  link.click()
  URL.revokeObjectURL(link.href)
}

async function handleFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }
  const result = props.importBackup(await file.text())
  feedback.value = result.ok ? messages.backup.imported : messages.backup[result.reason]
  input.value = ''
}
</script>

<template>
  <section class="card">
    <h2>{{ messages.backup.title }}</h2>
    <p class="backup__intro">{{ messages.backup.intro }}</p>
    <div class="backup__actions">
      <button type="button" class="button button--quiet" @click="downloadBackup">
        {{ messages.backup.export }}
      </button>

      <label class="button button--quiet backup__import">
        {{ messages.backup.import }}
        <input type="file" accept="application/json,.json" hidden @change="handleFile" />
      </label>
    </div>
    <p v-if="feedback" class="backup__feedback" role="status">{{ feedback }}</p>
  </section>
</template>

<style scoped>
.backup__intro {
  color: var(--color-muted);
  font-size: 0.9rem;
}

.backup__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-small);
}

.backup__import {
  display: inline-block;
}
</style>

import type { BackupFile, ClosedCycle, Expense, Settings } from '../domain/types'
import { isClosedCycle, isExpense, isSettings, keepValid } from './guards'

export const BACKUP_VERSION = 1

export interface BackupContent {
  settings: Settings | null
  expenses: readonly Expense[]
  closedCycles: readonly ClosedCycle[]
}

export function createBackup(content: BackupContent, now: Date = new Date()): string {
  const backup: BackupFile = {
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    settings: content.settings,
    expenses: [...content.expenses],
    closedCycles: [...content.closedCycles],
  }
  return JSON.stringify(backup, null, 2)
}

export type BackupParseResult =
  | { ok: true; backup: BackupFile }
  | { ok: false; reason: 'notJson' | 'wrongVersion' | 'invalidContent' }

export function parseBackup(text: string): BackupParseResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'notJson' }
  }


import { resolveBackend } from '../storage/storage'
import { createAppState } from './app-state'
import type { AppState } from './app-state'

let sharedState: AppState | null = null

export function useAppState(): AppState {
  sharedState ??= createAppState(resolveBackend())
  return sharedState
}

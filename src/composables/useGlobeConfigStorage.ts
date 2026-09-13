import { reactive, ref } from 'vue'
import { cloneDefaultGlobeConfig } from '../config/defaultGlobeConfig'
import type { GlobeVisualConfig } from '../types/globe'

const CONFIG_VERSION = 1

interface StoredGlobeConfig {
  version: number
  config: GlobeVisualConfig
}

function isStoredGlobeConfig(value: unknown): value is StoredGlobeConfig {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<StoredGlobeConfig>
  return candidate.version === CONFIG_VERSION && Boolean(candidate.config)
}

export function useGlobeConfigStorage(storageKey: string) {
  const config = reactive<GlobeVisualConfig>(cloneDefaultGlobeConfig())
  const saveMessage = ref('')

  function load() {
    if (typeof window === 'undefined') return

    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) return
      const stored: unknown = JSON.parse(raw)
      if (isStoredGlobeConfig(stored)) {
        Object.assign(config, cloneDefaultGlobeConfig(), stored.config)
      }
    } catch {
      saveMessage.value = '已保存的设置无法读取。'
    }
  }

  function save() {
    if (typeof window === 'undefined') return false

    const payload: StoredGlobeConfig = {
      version: CONFIG_VERSION,
      config: { ...config },
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload))
      saveMessage.value = '参数已保存到本机。'
      return true
    } catch {
      saveMessage.value = '参数保存失败。'
      return false
    }
  }

  function reset() {
    Object.assign(config, cloneDefaultGlobeConfig())
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey)
    }
    saveMessage.value = '已恢复默认参数。'
  }

  function exportConfig() {
    return JSON.stringify(
      { version: CONFIG_VERSION, config: { ...config } },
      null,
      2,
    )
  }

  load()

  return { config, saveMessage, load, save, reset, exportConfig }
}

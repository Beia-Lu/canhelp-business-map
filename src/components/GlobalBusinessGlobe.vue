<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import GlobeDebugPanel from './global-business-globe/GlobeDebugPanel.vue'
import GlobeMarkerLayer from './global-business-globe/GlobeMarkerLayer.vue'
import { useBusinessCountriesStorage } from '../composables/useBusinessCountriesStorage'
import { useCobeGlobe } from '../composables/useCobeGlobe'
import { useGlobeConfigStorage } from '../composables/useGlobeConfigStorage'
import { businessCountries } from '../data/businessCountries'
import type { BusinessCountry, GlobeVisualConfig } from '../types/globe'

const props = withDefaults(defineProps<{
  countries?: BusinessCountry[]
  debug?: boolean
  storageKey?: string
}>(), {
  countries: () => businessCountries,
  debug: undefined,
  storageKey: 'canhelp-business-globe-config',
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const panelOpen = ref(
  typeof window === 'undefined' || !window.matchMedia('(max-width: 760px)').matches,
)
const sourceCountriesRef = toRef(props, 'countries')
const {
  countries: editableCountries,
  add: addCountry,
  remove: removeCountry,
  save: saveCountries,
  reset: resetCountries,
} = useBusinessCountriesStorage(sourceCountriesRef, `${props.storageKey}:countries`)
const visibleCountries = computed(() => editableCountries.value.filter((country) => country.visible))
const debugAvailable = computed(() => props.debug === true || (props.debug !== false && import.meta.env.DEV))
const showPanel = computed(() => debugAvailable.value && panelOpen.value)
const { config, saveMessage, save, reset, exportConfig } = useGlobeConfigStorage(props.storageKey)
const {
  ready,
  error,
  interacting,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
} = useCobeGlobe(canvasRef, config, editableCountries)

watch(debugAvailable, (available) => {
  if (!available) panelOpen.value = false
})

function updateConfig(key: keyof GlobeVisualConfig, value: number | string) {
  ;(config[key] as number | string) = value
  saveMessage.value = ''
}

function saveParameters() {
  const configSaved = save()
  const countriesSaved = saveCountries()
  saveMessage.value = configSaved && countriesSaved
    ? '参数和国家数据已保存到本机。'
    : '保存失败，请检查浏览器的本地存储权限。'
}

function resetParameters() {
  reset()
  resetCountries()
  saveMessage.value = '已恢复默认参数和国家数据。'
}

defineExpose({
  getConfig: () => ({ ...config }),
  getCountries: () => editableCountries.value.map((country) => ({ ...country })),
  addCountry,
  removeCountry,
  saveParameters,
  resetParameters,
  exportConfig,
})
</script>

<template>
  <section
    class="business-globe"
    :class="{
      'business-globe--with-panel': showPanel,
      'business-globe--interacting': interacting,
    }"
    aria-label="Interactive global business map"
  >
    <div class="business-globe__stage">
      <div class="business-globe__eyebrow" aria-hidden="true">
        <span /> Global footprint
      </div>

      <div class="business-globe__canvas-wrap">
        <canvas
          ref="canvasRef"
          class="business-globe__canvas"
          :class="{ 'business-globe__canvas--ready': ready }"
          role="img"
          aria-label="Rotating dotted world globe. Drag to rotate and focus a location marker for details."
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
          @lostpointercapture="onPointerCancel"
        />

        <GlobeMarkerLayer
          v-if="ready && !error"
          :countries="visibleCountries"
          :config="config"
        />

        <div v-if="!ready && !error" class="business-globe__loading" aria-live="polite">
          Preparing globe
        </div>
        <p v-if="error" class="business-globe__error" role="alert">{{ error }}</p>
      </div>

      <p class="business-globe__hint">
        <span aria-hidden="true">↔</span> Drag to explore
      </p>
    </div>

    <GlobeDebugPanel
      v-if="showPanel"
      :config="config"
      :countries="editableCountries"
      :save-message="saveMessage"
      @update="updateConfig"
      @save="saveParameters"
      @reset="resetParameters"
      @add-country="addCountry"
      @remove-country="removeCountry"
      @close="panelOpen = false"
    />

    <button
      v-else-if="debugAvailable"
      class="business-globe__open-panel"
      type="button"
      @click="panelOpen = true"
    >
      视觉参数
    </button>
  </section>
</template>

<style scoped>
.business-globe {
  position: relative;
  display: grid;
  min-height: clamp(480px, 72vh, 760px);
  background: #fbfcfb;
  border: 1px solid #edf0ef;
  border-radius: 12px;
  overflow: hidden;
  isolation: isolate;
}

.business-globe--with-panel {
  grid-template-columns: minmax(0, 1fr) 320px;
}

.business-globe__stage {
  position: relative;
  display: grid;
  min-width: 0;
  overflow: hidden;
  place-items: center;
}

.business-globe__stage::before {
  position: absolute;
  inset: 10% 8%;
  z-index: -1;
  background: radial-gradient(circle, rgb(232 237 235 / 55%) 0, rgb(251 252 251 / 0%) 65%);
  content: '';
}

.business-globe__eyebrow {
  position: absolute;
  top: 22px;
  left: 25px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #626b68;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.business-globe__eyebrow span {
  width: 6px;
  height: 6px;
  background: #39c987;
  border-radius: 50%;
}

.business-globe__canvas-wrap {
  position: relative;
  width: min(90%, 640px);
  aspect-ratio: 1;
}

.business-globe__canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: grab;
  touch-action: none;
  contain: layout paint size;
  transition: opacity 600ms ease;
}

.business-globe__canvas--ready {
  opacity: 1;
}

.business-globe--interacting .business-globe__canvas {
  cursor: grabbing;
}

.business-globe__loading,
.business-globe__error {
  position: absolute;
  inset: 0;
  display: grid;
  margin: 0;
  color: #78817e;
  font-size: 11px;
  letter-spacing: 0.08em;
  place-items: center;
  text-transform: uppercase;
}

.business-globe__error {
  color: #8b514d;
  text-transform: none;
}

.business-globe__hint {
  position: absolute;
  bottom: 21px;
  left: 25px;
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: #929a97;
  font-size: 9px;
}

.business-globe__hint span {
  font-size: 13px;
}

.business-globe :deep(.debug-panel) {
  z-index: 8;
  height: calc(100% - 24px);
  margin: 12px 12px 12px 0;
}

.business-globe__open-panel {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 8;
  min-height: 34px;
  padding: 0 13px;
  color: #404745;
  background: #f4f6f5;
  border: 1px solid #dce2df;
  border-radius: 5px;
  font: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.business-globe__open-panel:hover {
  background: #e9edeb;
}

.business-globe__open-panel:focus-visible {
  outline: 2px solid #35a872;
  outline-offset: 2px;
}

@media (max-width: 760px) {
  .business-globe,
  .business-globe--with-panel {
    min-height: 0;
    grid-template-columns: 1fr;
  }

  .business-globe__stage {
    min-height: 500px;
  }

  .business-globe__canvas-wrap {
    width: min(120%, 580px);
  }

  .business-globe :deep(.debug-panel) {
    height: auto;
    max-height: 520px;
    margin: 0 10px 10px;
  }

  .business-globe__open-panel {
    top: 46px;
    right: auto;
    left: 17px;
  }
}

@media (max-width: 480px) {
  .business-globe__stage {
    min-height: 430px;
  }

  .business-globe__eyebrow {
    top: 17px;
    left: 17px;
  }

  .business-globe__canvas-wrap {
    width: 118%;
  }

  .business-globe__hint {
    bottom: 15px;
    left: 17px;
  }

}

@media (prefers-reduced-motion: reduce) {
  .business-globe__canvas {
    transition: none;
  }
}
</style>

<script setup lang="ts">
import { ref, watch, type CSSProperties } from 'vue'
import type { BusinessCountry, GlobeVisualConfig } from '../../types/globe'
import GlobeInfoCard from './GlobeInfoCard.vue'

const props = defineProps<{
  countries: BusinessCountry[]
  config: GlobeVisualConfig
}>()

const activeCountryId = ref<string | null>(null)

watch(
  () => props.countries,
  (countries) => {
    if (activeCountryId.value && !countries.some((country) => country.id === activeCountryId.value)) {
      activeCountryId.value = null
    }
  },
  { deep: true },
)

function toggleCountry(countryId: string) {
  activeCountryId.value = activeCountryId.value === countryId ? null : countryId
}

function markerStyle(country: BusinessCountry): CSSProperties {
  return {
    positionAnchor: `--cobe-${country.id}`,
    top: 'anchor(center)',
    left: 'anchor(center)',
    opacity: `var(--cobe-visible-${country.id}, 0)`,
  } as CSSProperties
}
</script>

<template>
  <div class="marker-layer" aria-label="Business locations">
    <div
      v-for="country in countries"
      :key="country.id"
      class="globe-marker"
      :class="{
        'globe-marker--active': activeCountryId === country.id,
        'globe-marker--show-all': config.cardDisplayMode === 'all',
      }"
      :style="markerStyle(country)"
    >
      <button
        class="globe-marker__trigger"
        :class="{ 'globe-marker__trigger--pulse': country.marker?.pulse }"
        :style="{
          '--marker-color': country.marker?.color ?? config.markerColor,
          '--marker-pixel-size': `${Math.max(7, config.markerSize * 190)}px`,
        }"
        type="button"
        :aria-label="`查看${country.nameZh} ${country.name}`"
        :aria-expanded="activeCountryId === country.id"
        :aria-controls="`country-card-${country.id}`"
        @click="toggleCountry(country.id)"
      >
        <span aria-hidden="true" />
      </button>

      <GlobeInfoCard
        :id="`country-card-${country.id}`"
        :country="country"
        :background="config.cardBackground"
        :offset-x="config.cardOffsetX"
        :offset-y="config.cardOffsetY"
        :chinese-color="config.cardChineseColor"
        :chinese-opacity="config.cardChineseOpacity"
        :english-color="config.cardEnglishColor"
        :english-opacity="config.cardEnglishOpacity"
      />
    </div>
  </div>
</template>

<style scoped>
.marker-layer {
  display: contents;
}

.globe-marker {
  position: absolute;
  width: 1px;
  height: 1px;
  filter: blur(calc((1 - var(--cobe-visible, 1)) * 5px));
  transform: translate(-50%, -50%);
  transition: opacity 160ms linear;
  pointer-events: none;
}

.globe-marker__trigger {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%);
  place-items: center;
  pointer-events: auto;
}

.globe-marker__trigger > span {
  width: var(--marker-pixel-size);
  height: var(--marker-pixel-size);
  border: 2px solid #fff;
  border-radius: 50%;
  background: var(--marker-color);
  box-shadow: 0 2px 8px rgb(14 56 40 / 18%);
}

.globe-marker__trigger:focus-visible {
  outline: 2px solid #111414;
  outline-offset: 2px;
}

.globe-marker__trigger--pulse::before {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid var(--marker-color);
  border-radius: 50%;
  content: '';
  animation: marker-pulse 2.4s ease-out infinite;
}

.globe-marker:hover :deep(.country-card),
.globe-marker:focus-within :deep(.country-card),
.globe-marker--active :deep(.country-card),
.globe-marker--show-all :deep(.country-card) {
  transform: translateY(0) scale(1);
  opacity: 1;
}

@keyframes marker-pulse {
  0% { opacity: 0.7; transform: scale(0.5); }
  70%, 100% { opacity: 0; transform: scale(1.9); }
}

@media (prefers-reduced-motion: reduce) {
  .globe-marker,
  .globe-marker__trigger--pulse::before {
    transition: none;
    animation: none;
  }
}
</style>

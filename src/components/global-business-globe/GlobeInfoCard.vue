<script setup lang="ts">
import type { BusinessCountry } from '../../types/globe'

defineProps<{
  country: BusinessCountry
  background: string
  offsetX: number
  offsetY: number
  chineseColor: string
  chineseOpacity: number
  englishColor: string
  englishOpacity: number
}>()
</script>

<template>
  <article
    class="country-card"
    :class="[`country-card--${country.card.side ?? 'left'}`]"
    :style="{
      '--card-background': background,
      '--card-offset-x': `${offsetX}px`,
      '--card-offset-y': `${offsetY}px`,
      '--chinese-color': chineseColor,
      '--chinese-opacity': chineseOpacity,
      '--english-color': englishColor,
      '--english-opacity': englishOpacity,
    }"
    :aria-label="`${country.nameZh}, ${country.name}`"
  >
    <span class="country-card__signal" aria-hidden="true" />
    <strong class="country-card__chinese">{{ country.nameZh }}</strong>
    <span class="country-card__divider" aria-hidden="true" />
    <span class="country-card__english">{{ country.name }}</span>
  </article>
</template>

<style scoped>
.country-card {
  position: absolute;
  z-index: 4;
  bottom: calc(15px - var(--card-offset-y));
  left: calc(12px + var(--card-offset-x));
  display: flex;
  align-items: center;
  width: max-content;
  min-height: 58px;
  padding: 12px 18px;
  color: #fff;
  background: var(--card-background);
  border: 1px solid rgb(255 255 255 / 7%);
  border-radius: 12px;
  box-shadow: 0 12px 30px rgb(15 21 21 / 14%);
  gap: 12px;
  pointer-events: none;
  transform: translateY(4px) scale(0.97);
  transform-origin: bottom left;
  opacity: 0;
  transition: opacity 180ms ease, transform 220ms cubic-bezier(0.2, 0.75, 0.25, 1);
}

.country-card--left {
  right: calc(12px - var(--card-offset-x));
  left: auto;
  transform-origin: bottom right;
}

.country-card__signal {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #3bd092;
  box-shadow: 0 0 0 6px rgb(59 208 146 / 22%);
  flex: 0 0 auto;
}

.country-card__chinese {
  color: var(--chinese-color);
  font-family: "Source Han Sans CN", "Microsoft YaHei", sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  opacity: var(--chinese-opacity);
  white-space: nowrap;
}

.country-card__divider {
  width: 1px;
  height: 27px;
  background: #aeb5b3;
  opacity: 0.78;
  flex: 0 0 auto;
}

.country-card__english {
  color: var(--english-color);
  font-family: "Krona One", ui-sans-serif, sans-serif;
  font-size: 12px;
  line-height: 1.15;
  opacity: var(--english-opacity);
  text-transform: uppercase;
  white-space: nowrap;
}

@media (max-width: 680px) {
  .country-card,
  .country-card--left {
    right: calc(12px - var(--card-offset-x));
    left: auto;
    min-height: 52px;
    padding: 10px 14px;
    border-radius: 10px;
    gap: 9px;
    transform-origin: bottom right;
  }

  .country-card__signal {
    width: 10px;
    height: 10px;
    box-shadow: 0 0 0 5px rgb(59 208 146 / 20%);
  }

  .country-card__chinese { font-size: 18px; }
  .country-card__divider { height: 23px; }
  .country-card__english { font-size: 9px; }
}

@media (prefers-reduced-motion: reduce) {
  .country-card { transition: none; }
}
</style>

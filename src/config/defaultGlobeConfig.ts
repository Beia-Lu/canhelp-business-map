import type { GlobeVisualConfig } from '../types/globe'

export const defaultGlobeConfig: GlobeVisualConfig = {
  scale: 0.94,
  offsetX: -34,
  offsetY: 4,
  rotationSpeed: 0.07,
  dotSize: 1,
  dotColor: '#f0f1f1',
  markerSize: 0.045,
  markerColor: '#35c987',
  cardOffsetX: 0,
  cardOffsetY: -18,
  cardBackground: '#111414',
  cardChineseColor: '#ffffff',
  cardChineseOpacity: 1,
  cardEnglishColor: '#b3bab8',
  cardEnglishOpacity: 0.9,
  cardDisplayMode: 'hover',
}

export function cloneDefaultGlobeConfig(): GlobeVisualConfig {
  return { ...defaultGlobeConfig }
}

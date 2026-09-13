export type RGBColor = [number, number, number]

export interface GlobeVisualConfig {
  scale: number
  offsetX: number
  offsetY: number
  rotationSpeed: number
  dotSize: number
  dotColor: string
  markerSize: number
  markerColor: string
  cardOffsetX: number
  cardOffsetY: number
  cardBackground: string
  cardChineseFontSize: number
  cardChineseColor: string
  cardChineseOpacity: number
  cardEnglishFontSize: number
  cardEnglishColor: string
  cardEnglishOpacity: number
  cardDisplayMode: 'hover' | 'all'
}

export interface CountryMarkerConfig {
  color?: string
  pulse?: boolean
}

export interface CountryCardConfig {
  status: string
  title?: string
  value: string
  body?: string
  side?: 'left' | 'right'
}

export interface BusinessCountry {
  id: string
  nameZh: string
  name: string
  code: string
  latitude: number
  longitude: number
  visible: boolean
  featured?: boolean
  marker?: CountryMarkerConfig
  card: CountryCardConfig
  business?: Record<string, unknown>
  isSample?: boolean
}

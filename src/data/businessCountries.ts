import type { BusinessCountry } from '../types/globe'

interface CountrySeed {
  id: string
  nameZh: string
  name: string
  code: string
  latitude: number
  longitude: number
  region: string
}

/**
 * Business locations supplied for the globe. Coordinates use each country's
 * capital or primary business city so markers resolve to a recognizable point.
 * Add, remove, or edit a row here without changing the renderer.
 */
const countrySeeds: CountrySeed[] = [
  { id: 'united-kingdom', nameZh: '英国', name: 'United Kingdom', code: 'GB', latitude: 51.5074, longitude: -0.1278, region: 'Europe' },
  { id: 'netherlands', nameZh: '荷兰', name: 'Netherlands', code: 'NL', latitude: 52.3676, longitude: 4.9041, region: 'Europe' },
  { id: 'germany', nameZh: '德国', name: 'Germany', code: 'DE', latitude: 52.52, longitude: 13.405, region: 'Europe' },
  { id: 'belgium', nameZh: '比利时', name: 'Belgium', code: 'BE', latitude: 50.8503, longitude: 4.3517, region: 'Europe' },
  { id: 'switzerland', nameZh: '瑞士', name: 'Switzerland', code: 'CH', latitude: 46.948, longitude: 7.4474, region: 'Europe' },
  { id: 'greece', nameZh: '希腊', name: 'Greece', code: 'GR', latitude: 37.9838, longitude: 23.7275, region: 'Europe' },
  { id: 'france', nameZh: '法国', name: 'France', code: 'FR', latitude: 48.8566, longitude: 2.3522, region: 'Europe' },
  { id: 'italy', nameZh: '意大利', name: 'Italy', code: 'IT', latitude: 41.9028, longitude: 12.4964, region: 'Europe' },
  { id: 'austria', nameZh: '奥地利', name: 'Austria', code: 'AT', latitude: 48.2082, longitude: 16.3738, region: 'Europe' },
  { id: 'portugal', nameZh: '葡萄牙', name: 'Portugal', code: 'PT', latitude: 38.7223, longitude: -9.1393, region: 'Europe' },
  { id: 'spain', nameZh: '西班牙', name: 'Spain', code: 'ES', latitude: 40.4168, longitude: -3.7038, region: 'Europe' },
  { id: 'egypt', nameZh: '埃及', name: 'Egypt', code: 'EG', latitude: 30.0444, longitude: 31.2357, region: 'Africa' },
  { id: 'china', nameZh: '中国', name: 'China', code: 'CN', latitude: 39.9042, longitude: 116.4074, region: 'Asia Pacific' },
  { id: 'malaysia', nameZh: '马来西亚', name: 'Malaysia', code: 'MY', latitude: 3.139, longitude: 101.6869, region: 'Asia Pacific' },
  { id: 'singapore', nameZh: '新加坡', name: 'Singapore', code: 'SG', latitude: 1.3521, longitude: 103.8198, region: 'Asia Pacific' },
  { id: 'thailand', nameZh: '泰国', name: 'Thailand', code: 'TH', latitude: 13.7563, longitude: 100.5018, region: 'Asia Pacific' },
  { id: 'indonesia', nameZh: '印度尼西亚', name: 'Indonesia', code: 'ID', latitude: -6.2088, longitude: 106.8456, region: 'Asia Pacific' },
  { id: 'philippines', nameZh: '菲律宾', name: 'Philippines', code: 'PH', latitude: 14.5995, longitude: 120.9842, region: 'Asia Pacific' },
]

export const businessCountries: BusinessCountry[] = countrySeeds.map(({ region, ...country }) => ({
  ...country,
  visible: true,
  marker: { pulse: true },
  card: {
    status: '',
    value: '',
    side: 'left',
  },
  business: { region, source: 'business-list' },
}))

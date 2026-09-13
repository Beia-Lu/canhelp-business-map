import { ref, type Ref } from 'vue'
import type { BusinessCountry } from '../types/globe'

const COUNTRY_DATA_VERSION = 2

interface StoredCountries {
  version: number
  countries: BusinessCountry[]
}

function cloneCountries(countries: BusinessCountry[]) {
  return countries.map((country) => ({
    ...country,
    marker: country.marker ? { ...country.marker } : undefined,
    card: { ...country.card },
    business: country.business ? { ...country.business } : undefined,
  }))
}

function isStoredCountries(value: unknown): value is StoredCountries {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<StoredCountries>
  return candidate.version === COUNTRY_DATA_VERSION && Array.isArray(candidate.countries)
}

export function useBusinessCountriesStorage(
  initialCountries: Ref<BusinessCountry[]>,
  storageKey: string,
) {
  const countries = ref<BusinessCountry[]>(cloneCountries(initialCountries.value))

  function load() {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) return
      const stored: unknown = JSON.parse(raw)
      if (isStoredCountries(stored)) {
        countries.value = cloneCountries(stored.countries)
      }
    } catch {
      // Invalid local data falls back to the source configuration.
    }
  }

  function add(country: BusinessCountry) {
    countries.value = [...countries.value, cloneCountries([country])[0]!]
  }

  function remove(countryId: string) {
    countries.value = countries.value.filter((country) => country.id !== countryId)
  }

  function save() {
    if (typeof window === 'undefined') return false
    const payload: StoredCountries = {
      version: COUNTRY_DATA_VERSION,
      countries: cloneCountries(countries.value),
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload))
      return true
    } catch {
      return false
    }
  }

  function reset() {
    countries.value = cloneCountries(initialCountries.value)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey)
    }
  }

  load()

  return { countries, add, remove, save, reset }
}

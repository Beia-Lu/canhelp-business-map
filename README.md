# Global Business Globe

A reusable Vue 3 + TypeScript dotted globe component powered by [COBE](https://github.com/shuding/cobe). It is designed for a restrained global business presentation rather than satellite imagery or GIS workflows.

## Run locally

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
pnpm preview
```

## Component

The public component is `src/components/GlobalBusinessGlobe.vue`.

```vue
<script setup lang="ts">
import GlobalBusinessGlobe from './components/GlobalBusinessGlobe.vue'
import { businessCountries } from './data/businessCountries'
</script>

<template>
  <GlobalBusinessGlobe :countries="businessCountries" />
</template>
```

Supported props:

- `countries`: independent business-location data.
- `debug`: explicitly show or hide the tuning panel. When omitted, the panel is visible only in development.
- `storageKey`: localStorage key used by Save.

The component exposes `getConfig()`, `getCountries()`, `addCountry()`, `removeCountry()`, `saveParameters()`, `resetParameters()`, and `exportConfig()` for host applications.

## Editing countries

Edit `src/data/businessCountries.ts`, or use the development panel. Each country record supports:

- Chinese name, English name, and ISO code;
- latitude and longitude;
- visibility and featured-card state;
- marker color and pulse behaviour;
- card side and arbitrary future `business` fields.

The default dataset contains the 18 supplied business countries, mapped to the coordinates of each capital or primary business city.

## Debug configuration

The Chinese development panel controls visual properties, bilingual text sizes/colors/opacities, hover/all card display, and country records. Cards use 8px vertical and 12px horizontal padding, so the frame follows the selected font sizes. New countries require a Chinese name, English name, two-letter code, latitude, and longitude. Save writes versioned visual and country payloads to localStorage. Export Config remains available through the component API.

The supplied fonts are bundled at `src/assets/fonts`: Source Han Sans CN Bold for Chinese card names and Krona One Regular for uppercase English names. The complete CJK font is intentionally retained so countries added later keep their glyphs; verify and retain the relevant font license notices when distributing the component.

The panel is rendered when either condition is true:

```ts
import.meta.env.DEV || props.debug === true
```

Passing `:debug="false"` always hides it.

## Third-party license

COBE is distributed under the MIT License. Retain the dependency's copyright and license notices in commercial distributions. Review the provenance and attribution requirements of any replacement geography asset before release.

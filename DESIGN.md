# Design system

## Visual direction

The component is a quiet business-coverage instrument: paper-white space, a pale spherical shell, precise grey continental dots, restrained green location signals, and near-black bilingual country labels. It deliberately avoids satellite texture, realistic terrain, glass effects, and GIS chrome.

## Tokens

- Canvas: `#fbfcfb`; page: `#f6f8f7`; controls: `#f5f7f6`.
- Globe tint: `#f0f1f1`; signal green: `#35c987`; card: `#111414`.
- Card Chinese: `#ffffff` at `1`; English: `#b3bab8` at `0.9`. Both are runtime parameters.
- Chinese display face: Source Han Sans CN Bold. English display face: Krona One Regular, uppercase.
- Primary radii: 12px surface/card, 8px control panel, 4–5px form controls.
- Spacing follows a compact 4/6/8/12/16/18px rhythm.

## Layout and responsive behavior

Desktop development uses a large globe stage and a 320px control rail. Production removes the rail automatically. At 760px and below the layout becomes one column and the panel starts collapsed behind a visible `视觉参数` button. At 480px and below the globe is allowed a modest controlled crop while cards flip to the left of their markers.

## Interaction and motion

The globe rotates slowly, yields immediately to pointer drag, continues with damped inertia, then resumes automatic rotation. Marker cards support hover, keyboard focus, click/tap persistence, and an `all` mode. Buttons expose `aria-expanded` and `aria-controls`. Pulse and transition animation stop under `prefers-reduced-motion`; automatic rotation and inertia also stop.

## Data and component architecture

`GlobalBusinessGlobe.vue` composes a COBE adapter, marker layer, country card, and debug panel. `BusinessCountry` holds Chinese/English names, ISO code, real latitude/longitude, marker options, and extension fields. Renderer code contains no country-specific branches. Source defaults live in `src/data/businessCountries.ts`; development edits are cloned into component state.

## Development controls and persistence

The Chinese panel tunes globe position/scale/rotation/dots, marker size/color, card offset/background, independent bilingual colors/opacities, card display mode, and country records. Saving writes versioned visual and country payloads to localStorage. Reset restores source defaults. Production hides the panel unless the host explicitly passes `debug=true`.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vue 3, TypeScript, Vite, and COBE. The globe should remain an independently integrable component rather than a one-off page.

## Users

Company website visitors viewing the organisation's global business footprint, and frontend engineers who maintain the country data and integrate the component into a larger Vue application.

## Product Purpose

Present global business locations on a restrained interactive dotted globe. Success means the visual matches the supplied light reference, remains smooth to rotate, and lets engineers update countries without touching rendering logic.

## Positioning

A presentation-focused global business globe: visually refined and lightweight, with business data, markers, and cards separated cleanly from its WebGL renderer.

## Operating Context

The component is designed for a company webpage. During design and development, a compact debug panel is used to tune visual parameters. Production usage hides that panel without changing globe behaviour.

## Capabilities and Constraints

- A pale dotted globe with continuous slow rotation, pointer drag, and light inertia.
- Country locations are driven by independent latitude/longitude data.
- Markers and information cards follow their locations while the globe moves.
- A development panel edits globe, marker, bilingual card, and country-location data without renderer changes.
- Saved settings reload reliably; JSON export is reserved as a future-compatible capability.
- Production must not require deleting debug code manually.
- Example countries are illustrative until replaced with approved company data.

## Brand Commitments

Use the supplied reference image as the binding visual direction: white or near-white background, fine cool-grey continental dots, restrained green markers, sparse black information cards, and calm motion. Avoid satellite imagery, realistic terrain, and GIS-heavy styling.

## Evidence on Hand

- Supplied visual reference: `codex-clipboard-73c88017-b7b4-4943-8e75-2d2e0dbbee74.png`.
- Supplied card reference: `codex-clipboard-82045d94-fb0e-4690-8c6b-f553b36f8850.png`.
- Supplied display fonts: Source Han Sans CN Bold for Chinese and Krona One Regular for English.
- No verified company country list or production copy has been supplied; demonstration locations remain sample content.

## Product Principles

- Keep business data editable without rendering knowledge.
- Make motion feel continuous across automatic and manual control.
- Prefer a small, stable public component API over renderer-specific coupling.
- Protect performance on high-density and mobile displays.
- Keep development controls useful but invisible in production by default.

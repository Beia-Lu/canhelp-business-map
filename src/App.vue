<script setup lang="ts">
import GlobalBusinessGlobe from './components/GlobalBusinessGlobe.vue'
import { businessCountries } from './data/businessCountries'
</script>

<template>
  <main class="preview-shell">
    <header class="preview-heading">
      <h1>Global business map</h1>
      <p>Interactive component preview · illustrative data</p>
    </header>

    <GlobalBusinessGlobe
      class="preview-globe"
      :countries="businessCountries"
      storage-key="canhelp-business-globe:visual-config"
    />

    <p class="sample-note">
      Sample locations and values — replace them in
      <code>src/data/businessCountries.ts</code>.
    </p>
  </main>
</template>

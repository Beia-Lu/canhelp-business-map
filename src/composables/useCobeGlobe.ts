import createGlobe, { type COBEOptions } from 'cobe'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from 'vue'
import type { BusinessCountry, GlobeVisualConfig, RGBColor } from '../types/globe'

type PointerEventHandler = (event: PointerEvent) => void

function hexToRgb(hex: string): RGBColor {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((character) => character + character).join('')
    : normalized
  const number = Number.parseInt(value, 16)

  if (Number.isNaN(number)) return [0.5, 0.5, 0.5]

  return [
    ((number >> 16) & 255) / 255,
    ((number >> 8) & 255) / 255,
    (number & 255) / 255,
  ]
}

function markerColor(country: BusinessCountry): RGBColor | undefined {
  return country.marker?.color ? hexToRgb(country.marker.color) : undefined
}

export function useCobeGlobe(
  canvasRef: Ref<HTMLCanvasElement | null>,
  config: GlobeVisualConfig,
  countries: Ref<BusinessCountry[]>,
) {
  const ready = ref(false)
  const error = ref('')
  const interacting = ref(false)

  let globe: ReturnType<typeof createGlobe> | undefined
  let resizeObserver: ResizeObserver | undefined
  let intersectionObserver: IntersectionObserver | undefined
  let reducedMotionQuery: MediaQueryList | undefined
  let width = 0
  let height = 0
  // Starts over Africa and Europe to match the supplied visual reference.
  let phi = -1.92
  let theta = 0.14
  let horizontalVelocity = 0
  let verticalVelocity = 0
  let activePointerId: number | null = null
  let lastPointerX = 0
  let lastPointerY = 0
  let lastPointerTime = 0
  let lastFrameTime = performance.now()
  let isVisible = true
  let reducedMotion = false
  let onReducedMotionChange: ((event: MediaQueryListEvent) => void) | undefined
  let animationFrame = 0
  let markersDirty = false
  let dimensionsDirty = false

  function buildMarkers() {
    return countries.value
      .filter((country) => country.visible)
      .map((country) => ({
        location: [country.latitude, country.longitude] as [number, number],
        size: config.markerSize,
        color: markerColor(country),
        id: country.id,
      }))
  }

  function releasePointer(event?: PointerEvent) {
    if (activePointerId === null) return
    if (event && event.pointerId !== activePointerId) return

    const canvas = canvasRef.value
    if (event && canvas?.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId)
    }
    activePointerId = null
    interacting.value = false
  }

  const onPointerDown: PointerEventHandler = (event) => {
    if (activePointerId !== null) return
    activePointerId = event.pointerId
    lastPointerX = event.clientX
    lastPointerY = event.clientY
    lastPointerTime = performance.now()
    horizontalVelocity = 0
    verticalVelocity = 0
    interacting.value = true
    canvasRef.value?.setPointerCapture(event.pointerId)
  }

  const onPointerMove: PointerEventHandler = (event) => {
    if (event.pointerId !== activePointerId || !width) return

    const now = performance.now()
    const elapsed = Math.max(8, now - lastPointerTime) / 1000
    const deltaX = event.clientX - lastPointerX
    const deltaY = event.clientY - lastPointerY
    const horizontalDelta = deltaX / width * 3.3
    const verticalDelta = deltaY / Math.max(height, 1) * 2.1

    phi += horizontalDelta
    theta = Math.max(-0.7, Math.min(0.7, theta - verticalDelta))
    horizontalVelocity = horizontalDelta / elapsed
    verticalVelocity = -verticalDelta / elapsed

    lastPointerX = event.clientX
    lastPointerY = event.clientY
    lastPointerTime = now
  }

  const onPointerUp: PointerEventHandler = (event) => releasePointer(event)
  const onPointerCancel: PointerEventHandler = (event) => releasePointer(event)

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion = reducedMotionQuery.matches
    onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
    }
    reducedMotionQuery.addEventListener('change', onReducedMotionChange)

    resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return
      width = Math.max(1, entry.contentRect.width)
      height = Math.max(1, entry.contentRect.height)
      dimensionsDirty = true
    })
    resizeObserver.observe(canvas)
    width = Math.max(1, canvas.clientWidth)
    height = Math.max(1, canvas.clientHeight)

    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true
    }, { threshold: 0.01 })
    intersectionObserver.observe(canvas)

    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width,
        height,
        phi,
        theta,
        dark: 0,
        diffuse: 0.9,
        mapSamples: 18000,
        mapBrightness: 3.1,
        baseColor: hexToRgb(config.dotColor),
        markerColor: hexToRgb(config.markerColor),
        glowColor: [0.96, 0.97, 0.97],
        offset: [config.offsetX, config.offsetY],
        scale: config.scale,
        markerElevation: 0.012,
        markers: buildMarkers(),
      })

      const renderFrame = (now: number) => {
        const delta = Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000))
        lastFrameTime = now

        if (isVisible && !interacting.value && !reducedMotion) {
          const inertiaActive = Math.abs(horizontalVelocity) > 0.002 || Math.abs(verticalVelocity) > 0.002
          if (inertiaActive) {
            phi += horizontalVelocity * delta
            theta = Math.max(-0.7, Math.min(0.7, theta + verticalVelocity * delta))
            const damping = Math.exp(-4.7 * delta)
            horizontalVelocity *= damping
            verticalVelocity *= damping
          } else {
            horizontalVelocity = 0
            verticalVelocity = 0
            phi += config.rotationSpeed * delta
          }
        }

        const updates: Partial<COBEOptions> = {
          phi,
          theta,
          scale: config.scale,
          offset: [config.offsetX, config.offsetY],
          mapSamples: Math.round(18000 / Math.max(0.55, config.dotSize)),
          mapBrightness: 3.1 * Math.max(0.8, Math.min(1.2, config.dotSize)),
          baseColor: hexToRgb(config.dotColor),
          markerColor: hexToRgb(config.markerColor),
          markerElevation: 0.012,
        }

        if (dimensionsDirty) {
          updates.width = width
          updates.height = height
          dimensionsDirty = false
        }
        if (markersDirty) {
          updates.markers = buildMarkers()
          markersDirty = false
        }

        globe?.update(updates)

        ready.value = true
        animationFrame = window.requestAnimationFrame(renderFrame)
      }

      animationFrame = window.requestAnimationFrame(renderFrame)
    } catch {
      error.value = 'The interactive globe could not start on this device.'
    }
  })

  watch(
    () => [config.markerSize, countries.value],
    () => {
      markersDirty = true
    },
    { deep: true },
  )

  onBeforeUnmount(() => {
    releasePointer()
    if (onReducedMotionChange) {
      reducedMotionQuery?.removeEventListener('change', onReducedMotionChange)
    }
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    window.cancelAnimationFrame(animationFrame)
    globe?.destroy()
  })

  return {
    ready,
    error,
    interacting,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  }
}

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { BusinessCountry, GlobeVisualConfig } from '../../types/globe'

const props = defineProps<{
  config: GlobeVisualConfig
  countries: BusinessCountry[]
  saveMessage: string
}>()

const emit = defineEmits<{
  update: [key: keyof GlobeVisualConfig, value: number | string]
  save: []
  reset: []
  close: []
  addCountry: [country: BusinessCountry]
  removeCountry: [countryId: string]
}>()

const countryMessage = ref('')
const countryForm = reactive({
  nameZh: '',
  name: '',
  code: '',
  latitude: 0,
  longitude: 0,
  pulse: true,
})

function updateNumber(key: keyof GlobeVisualConfig, event: Event) {
  emit('update', key, (event.target as HTMLInputElement).valueAsNumber)
}

function updateText(key: keyof GlobeVisualConfig, event: Event) {
  emit('update', key, (event.target as HTMLInputElement | HTMLSelectElement).value)
}

function addCustomCountry() {
  const code = countryForm.code.trim().toUpperCase()
  const nameZh = countryForm.nameZh.trim()
  const name = countryForm.name.trim()

  if (!nameZh || !name || !/^[A-Z]{2}$/.test(code)) {
    countryMessage.value = '请填写中英文名称和两位国家代码。'
    return
  }
  if (countryForm.latitude < -90 || countryForm.latitude > 90 || countryForm.longitude < -180 || countryForm.longitude > 180) {
    countryMessage.value = '纬度范围为 -90～90，经度范围为 -180～180。'
    return
  }
  if (props.countries.some((country) => country.code.toUpperCase() === code)) {
    countryMessage.value = `${code} 已存在。`
    return
  }

  emit('addCountry', {
    id: `${code.toLowerCase()}-${Date.now().toString(36)}`,
    nameZh,
    name,
    code,
    latitude: countryForm.latitude,
    longitude: countryForm.longitude,
    visible: true,
    marker: { pulse: countryForm.pulse },
    card: { status: '', value: '', side: 'left' },
    business: { source: 'debug-panel' },
  })

  countryMessage.value = `已添加${nameZh}，点击“保存参数”可永久保留。`
  Object.assign(countryForm, { nameZh: '', name: '', code: '', latitude: 0, longitude: 0, pulse: true })
}

function removeCustomCountry(country: BusinessCountry) {
  emit('removeCountry', country.id)
  countryMessage.value = `已移除${country.nameZh}，点击“保存参数”可保存更改。`
}
</script>

<template>
  <aside class="debug-panel" aria-label="地球视觉参数">
    <header class="debug-panel__header">
      <div>
        <p>视觉参数</p>
        <span>仅开发环境显示</span>
      </div>
      <button type="button" aria-label="隐藏视觉参数" @click="emit('close')">×</button>
    </header>

    <div class="debug-panel__body">
      <fieldset>
        <legend>地球</legend>
        <label><span>整体大小 <output>{{ config.scale.toFixed(2) }}</output></span><input :value="config.scale" type="range" min="0.68" max="1.1" step="0.01" @input="updateNumber('scale', $event)"></label>
        <label><span>水平位置 <output>{{ config.offsetX }}</output></span><input :value="config.offsetX" type="range" min="-120" max="120" step="1" @input="updateNumber('offsetX', $event)"></label>
        <label><span>垂直位置 <output>{{ config.offsetY }}</output></span><input :value="config.offsetY" type="range" min="-100" max="100" step="1" @input="updateNumber('offsetY', $event)"></label>
        <label><span>自动旋转速度 <output>{{ config.rotationSpeed.toFixed(2) }}</output></span><input :value="config.rotationSpeed" type="range" min="0" max="0.3" step="0.01" @input="updateNumber('rotationSpeed', $event)"></label>
        <label><span>点阵大小 <output>{{ config.dotSize.toFixed(2) }}</output></span><input :value="config.dotSize" type="range" min="0.55" max="1.8" step="0.05" @input="updateNumber('dotSize', $event)"></label>
        <label class="color-control"><span>点阵颜色 <output>{{ config.dotColor }}</output></span><input :value="config.dotColor" type="color" @input="updateText('dotColor', $event)"></label>
      </fieldset>

      <fieldset>
        <legend>定位点</legend>
        <label><span>定位点大小 <output>{{ config.markerSize.toFixed(3) }}</output></span><input :value="config.markerSize" type="range" min="0.02" max="0.1" step="0.005" @input="updateNumber('markerSize', $event)"></label>
        <label class="color-control"><span>定位点颜色 <output>{{ config.markerColor }}</output></span><input :value="config.markerColor" type="color" @input="updateText('markerColor', $event)"></label>
      </fieldset>

      <fieldset>
        <legend>悬浮卡片</legend>
        <label>
          <span>显示方式</span>
          <select :value="config.cardDisplayMode" @change="updateText('cardDisplayMode', $event)">
            <option value="hover">鼠标悬停时显示</option>
            <option value="all">全部一起显示</option>
          </select>
        </label>
        <label><span>水平偏移 <output>{{ config.cardOffsetX }}</output></span><input :value="config.cardOffsetX" type="range" min="-80" max="80" step="1" @input="updateNumber('cardOffsetX', $event)"></label>
        <label><span>垂直偏移 <output>{{ config.cardOffsetY }}</output></span><input :value="config.cardOffsetY" type="range" min="-80" max="60" step="1" @input="updateNumber('cardOffsetY', $event)"></label>
        <label class="color-control"><span>卡片背景 <output>{{ config.cardBackground }}</output></span><input :value="config.cardBackground" type="color" @input="updateText('cardBackground', $event)"></label>
        <label class="color-control"><span>中文颜色 <output>{{ config.cardChineseColor }}</output></span><input :value="config.cardChineseColor" type="color" @input="updateText('cardChineseColor', $event)"></label>
        <label><span>中文不透明度 <output>{{ config.cardChineseOpacity.toFixed(2) }}</output></span><input :value="config.cardChineseOpacity" type="range" min="0" max="1" step="0.05" @input="updateNumber('cardChineseOpacity', $event)"></label>
        <label class="color-control"><span>英文颜色 <output>{{ config.cardEnglishColor }}</output></span><input :value="config.cardEnglishColor" type="color" @input="updateText('cardEnglishColor', $event)"></label>
        <label><span>英文不透明度 <output>{{ config.cardEnglishOpacity.toFixed(2) }}</output></span><input :value="config.cardEnglishOpacity" type="range" min="0" max="1" step="0.05" @input="updateNumber('cardEnglishOpacity', $event)"></label>
      </fieldset>

      <fieldset>
        <legend>国家管理</legend>
        <div class="country-list" aria-label="当前国家">
          <div v-for="country in countries" :key="country.id" class="country-list__item">
            <span><strong>{{ country.nameZh }}</strong>{{ country.code }} · {{ country.latitude }}, {{ country.longitude }}</span>
            <button type="button" :aria-label="`删除${country.nameZh}`" @click="removeCustomCountry(country)">删除</button>
          </div>
        </div>

        <div class="country-form">
          <label><span>中文名称</span><input v-model.trim="countryForm.nameZh" type="text" placeholder="例如：英国"></label>
          <label><span>英文名称</span><input v-model.trim="countryForm.name" type="text" placeholder="United Kingdom"></label>
          <label><span>国家代码</span><input v-model.trim="countryForm.code" type="text" maxlength="2" placeholder="GB"></label>
          <div class="country-form__coordinates">
            <label><span>纬度</span><input v-model.number="countryForm.latitude" type="number" min="-90" max="90" step="0.0001"></label>
            <label><span>经度</span><input v-model.number="countryForm.longitude" type="number" min="-180" max="180" step="0.0001"></label>
          </div>
          <label class="checkbox-control"><input v-model="countryForm.pulse" type="checkbox"><span>启用呼吸动画</span></label>
          <button class="add-country-button" type="button" @click="addCustomCountry">添加国家</button>
          <p role="status" aria-live="polite">{{ countryMessage }}</p>
        </div>
      </fieldset>
    </div>

    <footer class="debug-panel__footer">
      <button class="save-button" type="button" @click="emit('save')">保存参数</button>
      <button class="reset-button" type="button" @click="emit('reset')">恢复默认</button>
      <p role="status" aria-live="polite">{{ saveMessage }}</p>
    </footer>
  </aside>
</template>

<style scoped>
.debug-panel { display: flex; min-width: 0; min-height: 0; color: #252a29; background: #f5f7f6; border: 1px solid #e0e5e3; border-radius: 8px; flex-direction: column; }
.debug-panel__header { display: flex; align-items: flex-start; justify-content: space-between; padding: 16px 17px 13px; border-bottom: 1px solid #e0e5e3; }
.debug-panel__header p, .debug-panel__header span { margin: 0; }
.debug-panel__header p { font-size: 13px; font-weight: 700; }
.debug-panel__header span { color: #717977; font-size: 10px; }
.debug-panel__header button { width: 28px; height: 28px; margin: -5px -6px 0 0; padding: 0; color: #5b6361; background: transparent; border: 0; border-radius: 4px; font-size: 20px; line-height: 1; cursor: pointer; }
.debug-panel__header button:hover { color: #111414; background: #e7ebe9; }
.debug-panel__body { min-width: 0; min-height: 0; padding: 4px 17px; overflow: auto; overflow-x: hidden; }
fieldset { display: grid; min-width: 0; gap: 12px; margin: 0; padding: 14px 0 16px; border: 0; border-bottom: 1px solid #e0e5e3; }
fieldset:last-child { border-bottom: 0; }
legend { padding: 0; color: #747d7a; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; }
label { display: grid; min-width: 0; gap: 6px; }
label > span { display: flex; justify-content: space-between; font-size: 11px; }
output { color: #7a827f; font-variant-numeric: tabular-nums; }
input[type='range'] { width: 100%; min-width: 0; max-width: 100%; height: 18px; margin: 0; accent-color: #202524; }
.color-control { grid-template-columns: 1fr 30px; align-items: center; }
.color-control > span { display: grid; justify-content: initial; }
.color-control output { font-size: 9px; }
input[type='color'] { width: 30px; height: 24px; padding: 2px; background: #fff; border: 1px solid #cbd2cf; border-radius: 4px; cursor: pointer; }
input[type='text'], input[type='number'], select { width: 100%; min-width: 0; height: 32px; padding: 0 9px; color: #252a29; background: #fff; border: 1px solid #cfd6d3; border-radius: 4px; font-size: 11px; }
.country-list { display: grid; gap: 6px; }
.country-list__item { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 7px; padding: 7px 8px; background: #edf1ef; border-radius: 4px; }
.country-list__item span { display: grid; overflow: hidden; color: #747d7a; font-size: 9px; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
.country-list__item strong { color: #252a29; font-size: 11px; }
.country-list__item button { padding: 4px 6px; color: #87524d; background: transparent; border: 0; font-size: 10px; cursor: pointer; }
.country-form { display: grid; gap: 9px; padding-top: 3px; }
.country-form__coordinates { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.checkbox-control { display: flex; align-items: center; gap: 7px; }
.checkbox-control span { display: inline; }
.checkbox-control input { margin: 0; accent-color: #202524; }
.country-form p { min-height: 14px; margin: 0; color: #68716e; font-size: 10px; line-height: 1.4; }
.add-country-button { min-height: 32px; color: #27302d; background: #e4e9e7; border: 1px solid #cdd5d2; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; }
.debug-panel__footer { display: grid; grid-template-columns: 1fr auto; gap: 7px; padding: 13px 17px 15px; border-top: 1px solid #e0e5e3; }
.debug-panel__footer button { min-height: 34px; border-radius: 5px; font: inherit; font-size: 11px; font-weight: 700; cursor: pointer; }
.save-button { color: #fff; border: 1px solid #111414; background: #111414; }
.save-button:hover { background: #303634; }
.reset-button { color: #4b5351; border: 1px solid #cfd6d3; background: transparent; }
.debug-panel__footer p { min-height: 12px; margin: 0; grid-column: 1 / -1; color: #68716e; font-size: 10px; }
button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #35a872; outline-offset: 2px; }
</style>

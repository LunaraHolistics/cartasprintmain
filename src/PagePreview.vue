<template>
  <div class="p-4 bg-gray-50 rounded-xl shadow-inner min-h-[300px]">

    <!-- CONTROLES SUPERIORES -->
    <div class="flex flex-wrap gap-4 items-center justify-between mb-4">

      <div v-if="backPages.length > 0" class="flex space-x-2">
        <button
          @click="isFront = true; currentPageIndex = 0"
          :class="[isFront ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-700']"
          class="px-3 py-1 rounded transition"
        >Frente</button>

        <button
          @click="isFront = false; currentPageIndex = 0"
          :class="[isFront ? 'bg-gray-300 text-gray-700' : 'bg-indigo-600 text-white']"
          class="px-3 py-1 rounded transition"
        >Verso</button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">Zoom</span>
        <input type="range" min="0.5" max="1.5" step="0.05" v-model="zoom" />
        <span class="text-sm">{{ zoom.toFixed(2) }}x</span>
      </div>

      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="showBleed" />
        Mostrar Sangria
      </label>

    </div>

    <!-- PREVIEW -->
    <div class="flex gap-4">

      <!-- MINIATURAS -->
      <div class="flex flex-col space-y-2 max-h-[80vh] overflow-y-auto">
        <div
          v-for="(p, i) in currentPages"
          :key="i"
          @click="currentPageIndex = i"
          :class="[
            'w-20 h-28 border cursor-pointer flex items-center justify-center text-xs',
            currentPageIndex === i ? 'border-indigo-600' : 'border-gray-300'
          ]"
        >
          {{ i + 1 }}
        </div>
      </div>

      <!-- VISUALIZAÇÃO -->
      <div class="flex-1 flex justify-center items-center overflow-hidden">

        <div
          class="page-preview relative bg-white border shadow-xl overflow-hidden"
          :style="getPageStyle()"
        >

          <!-- SANGRIA -->
          <div
            v-if="showBleed"
            class="absolute inset-0 border-2 border-red-500 pointer-events-none z-20"
            :style="{ margin: bleedPx + 'px' }"
          ></div>

          <div
            v-for="(card, cardIndex) in currentPage"
            :key="cardIndex"
            class="absolute overflow-hidden border border-dashed border-red-400"
            :style="getCardStyle(card)"
          >
            <img :src="card.src" class="w-full h-full object-cover" />
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
function getPageDimensions(settings) {
  var sizes = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 }
  }

  if (settings.pageSize === 'custom') {
    return { width: settings.customWidth, height: settings.customHeight }
  }

  return sizes[settings.pageSize] || sizes.A4
}

export default {
  name: 'PagePreview',

  props: {
    frontPages: { type: Array, default: () => [] },
    backPages: { type: Array, default: () => [] },
    settings: { type: Object, required: true }
  },

  data() {
    return {
      currentPageIndex: 0,
      isFront: true,
      mmToPx: 3.78,
      zoom: 1,
      showBleed: false,
      bleedMm: 3
    }
  },

  computed: {
    currentPages() {
      return this.isFront ? this.frontPages : this.backPages
    },

    currentPage() {
      return this.currentPages[this.currentPageIndex] || []
    },

    bleedPx() {
      return this.bleedMm * this.mmToPx
    }
  },

  methods: {
    getPageDimensions,

    getPageStyle() {
      var dims = this.getPageDimensions(this.settings)

      return {
        width: dims.width * this.mmToPx * this.zoom + 'px',
        height: dims.height * this.mmToPx * this.zoom + 'px'
      }
    },

    getCardStyle(card) {
      return {
        left: (card.x * this.mmToPx * this.zoom) + 'px',
        top: (card.y * this.mmToPx * this.zoom) + 'px',
        width: (card.displayWidth * this.mmToPx * this.zoom) + 'px',
        height: (card.displayHeight * this.mmToPx * this.zoom) + 'px'
      }
    }
  }
}
</script>

<style scoped>
.page-preview {
  background: white;
}
</style>

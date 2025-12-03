<template>
  <div class="p-4 bg-gray-50 rounded-xl shadow-inner min-h-[300px]">
    <div v-if="pages.length === 0" class="text-center text-gray-500 p-10">
      <p>Nenhuma página de layout gerada.</p>
    </div>

    <div v-else class="space-y-4">

      <div class="flex gap-4">

        <div class="flex flex-col space-y-2 max-h-[70vh] overflow-y-auto pr-2 border-r border-gray-200">
          <div
            v-for="(page, index) in pages"
            v-bind:key="index"
            v-on:click="selectPage(index)"
            v-bind:class="thumbClass(index)"
          >
            <span class="text-gray-800">Página</span>
            <span v-text="pageNumbers[index]" class="text-lg"></span>
          </div>
        </div>

        <div class="flex-1 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-700">Zoom</span>
              <input
                v-bind:type="'range'"
                v-bind:min="0.5"
                v-bind:max="2"
                v-bind:step="0.05"
                v-model.number="zoom"
              />
              <span class="text-sm font-semibold text-indigo-600" v-text="zoomLabel"></span>
            </div>

            <div class="flex items-center gap-2">
              <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input v-model="showBleed" v-bind:type="'checkbox'" />
                <span>Mostrar Sangria (</span><span v-text="bleedMm"></span><span>mm)</span>
              </label>
            </div>
          </div>

          <div class="flex-1 flex justify-center items-center overflow-auto max-h-[75vh]">
            <div
              class="relative bg-white border shadow-xl overflow-hidden"
              v-bind:style="pageStyle"
            >
              <div class="absolute top-2 left-2 text-xs bg-black bg-opacity-50 text-white px-2 py-0.5 rounded z-30">
                <span v-text="sideLabel"></span>
                <span> </span>
                <span v-text="displayPageNumber"></span>
              </div>

              <div
                v-if="showBleed"
                class="absolute inset-0 border-2 border-red-500 pointer-events-none z-20"
                v-bind:style="bleedStyle"
              ></div>

              <div
                v-for="(card, idx) in currentPage"
                v-bind:key="cardKey(idx, card)"
                class="absolute overflow-hidden border border-dashed border-red-400"
                v-bind:style="getCardStyle(card)"
              >
                <img v-bind:src="card.src" class="w-full h-full object-cover" />
              </div>

            </div>
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

  if (settings && settings.pageSize === 'custom') {
    return { width: settings.customWidth, height: settings.customHeight }
  }

  return sizes[(settings && settings.pageSize) || 'A4'] || sizes.A4
}

export default {
  name: 'PagePreview',
  props: {
    pages: { type: Array, required: true },
    settings: { type: Object, required: true }
  },
  data: function () {
    return {
      currentPageIndex: 0,
      mmToPx: 3.78,
      zoom: 1,
      showBleed: false,
      bleedMm: 3
    }
  },
  computed: {
    currentPage: function () {
      return this.pages[this.currentPageIndex] || []
    },
    pageNumbers: function () {
      var out = []
      var i = 1
      while (i <= this.pages.length) {
        out.push(i)
        i = i + 1
      }
      return out
    },
    pageStyle: function () {
      var dims = getPageDimensions(this.settings)
      return {
        width: dims.width * this.mmToPx * this.zoom + 'px',
        height: dims.height * this.mmToPx * this.zoom + 'px'
      }
    },
    bleedPx: function () {
      return this.bleedMm * this.mmToPx * this.zoom
    },
    bleedStyle: function () {
      return { margin: this.bleedPx + 'px' }
    },
    zoomLabel: function () {
      return Number(this.zoom).toFixed(2) + 'x'
    },
    displayPageNumber: function () {
      // safety: if pageNumbers is empty, return 0
      return this.pageNumbers[this.currentPageIndex] || 0
    },
    sideLabel: function () {
      return 'Página'
    }
  },
  methods: {
    selectPage: function (i) {
      this.currentPageIndex = i
    },
    thumbClass: function (i) {
      var base = 'w-20 h-28 border cursor-pointer flex flex-col items-center justify-center text-xs p-1 shadow-sm transition'
      if (this.currentPageIndex === i) {
        return base + ' border-indigo-600 bg-indigo-50 font-bold'
      }
      return base + ' border-gray-300 bg-white hover:bg-gray-100'
    },
    cardKey: function (idx, card) {
      // build a stable string key without using template strings in template
      var s = 'card-'
      if (card && card.src) {
        s = s + (card.src).toString()
      } else {
        s = s + String(idx)
      }
      return s
    },
    getCardStyle: function (card) {
      // guard defaults in case card fields missing
      var x = (card && card.x) ? card.x : 0
      var y = (card && card.y) ? card.y : 0
      var w = (card && card.displayWidth) ? card.displayWidth : 10
      var h = (card && card.displayHeight) ? card.displayHeight : 10

      return {
        left: x * this.mmToPx * this.zoom + 'px',
        top: y * this.mmToPx * this.zoom + 'px',
        width: w * this.mmToPx * this.zoom + 'px',
        height: h * this.mmToPx * this.zoom + 'px'
      }
    }
  }
}
</script>

<style scoped>
.page-preview {
  max-width: 100%;
  max-height: 100%;
}
</style>

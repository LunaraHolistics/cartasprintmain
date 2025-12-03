<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-gray-900">Pré-visualização</h3>
      <span class="text-sm text-gray-600">{{ pages.length }} página(s)</span>
    </div>

    <div 
      v-for="(page, pageIndex) in pages"
      :key="`page-${pageIndex}`"
      class="page-preview"
      :style="getPageStyle()"
    >
      <div class="absolute top-2 left-2 text-xs text-gray-400 font-medium">
        Página {{ pageIndex + 1 }}
      </div>

      <div 
        v-for="(card, cardIndex) in page"
        :key="`card-${pageIndex}-${cardIndex}`"
        class="card-container absolute"
        :style="getCardStyle(card)"
      >
        <img :src="card.src" :alt="`Card ${cardIndex}`" class="card-image">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PagePreview',
  props: {
    pages: {
      type: Array,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  methods: {
    getPageDimensions() {
      const sizes = {
        A4: { width: 210, height: 297 },
        A3: { width: 297, height: 420 }
      }
      
      if (this.settings.pageSize === 'custom') {
        return {
          width: this.settings.customWidth,
          height: this.settings.customHeight
        }
      }
      return sizes[this.settings.pageSize]
    },
    getPageStyle() {
      const dims = this.getPageDimensions()
      const mmToPx = 3.78
      
      return {
        width: dims.width * mmToPx + 'px',
        height: dims.height * mmToPx + 'px',
        position: 'relative',
        margin: '0 auto'
      }
    },
    getCardStyle(card) {
      const mmToPx = 3.78
      
      return {
        left: (card.x * mmToPx) + 'px',
        top: (card.y * mmToPx) + 'px',
        width: (card.displayWidth * mmToPx) + 'px',
        height: (card.displayHeight * mmToPx) + 'px'
      }
    }
  }
}
</script>

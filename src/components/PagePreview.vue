<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-gray-900">Pré-visualização</h3>
      <span class="text-sm text-gray-600">{{ pages.length }} página(s)</span>
    </div>

    <div 
      v-for="(page, pageIndex) in pages"
      :key="`page-${pageIndex}`"
      class="page-preview bg-white shadow-lg border-2 border-gray-200"
      :style="getPageStyle()"
    >
      <div class="absolute top-2 left-2 text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded">
        Página {{ pageIndex + 1 }}
      </div>

      <div 
        v-for="(card, cardIndex) in page"
        :key="`card-${pageIndex}-${cardIndex}`"
        class="card-container absolute overflow-hidden border border-dashed border-gray-300"
        :style="getCardStyle(card)"
      >
        <img 
          :src="card.src" 
          :alt="`Card ${cardIndex}`" 
          class="card-image w-full h-full object-cover"
        >
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
          width: this.settings.customWidth || 210,
          height: this.settings.customHeight || 297
        }
      }
      return sizes[this.settings.pageSize] || sizes.A4
    },
    getPageStyle() {
      const dims = this.getPageDimensions()
      const mmToPx = 3.78
      
      return {
        width: (dims.width * mmToPx) + 'px',
        height: (dims.height * mmToPx) + 'px',
        position: 'relative',
        margin: '0 auto',
        backgroundColor: '#f9fafb',
        display: 'block'
      }
    },
    getCardStyle(card) {
      const mmToPx = 3.78
      
      return {
        left: (card.x * mmToPx) + 'px',
        top: (card.y * mmToPx) + 'px',
        width: (card.displayWidth * mmToPx) + 'px',
        height: (card.displayHeight * mmToPx) + 'px',
        position: 'absolute',
        display: 'block'
      }
    }
  }
}
</script>

<style scoped>
.page-preview {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background-color: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
}

.card-container {
  background-color: white;
  border-radius: 2px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>

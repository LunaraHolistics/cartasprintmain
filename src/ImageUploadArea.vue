<template>
  <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
       @dragover.prevent="isDragging = true"
       @dragleave.prevent="isDragging = false"
       @drop.prevent="handleDrop"
       :class="{ 'bg-blue-50 border-blue-500': isDragging }">
    <input 
      ref="fileInput"
      @change="handleFileSelect"
      type="file" 
      multiple 
      accept="image/*"
      class="hidden"
    >
    
    <div class="flex flex-col items-center">
      <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
      </svg>
      <p class="text-gray-600 font-medium mb-1">Arraste imagens aqui ou clique para selecionar</p>
      <p class="text-gray-500 text-sm">Suporta JPG, PNG, GIF e WebP</p>
    </div>

    <button 
      @click="$refs.fileInput.click()"
      class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition"
    >
      Selecionar Arquivos
    </button>
  </div>
</template>

<script>
export default {
  name: 'ImageUploadArea',
  data() {
    return {
      isDragging: false
    }
  },
  methods: {
    handleFileSelect(event) {
      const files = event.target.files
      this.$emit('files-selected', files)
      event.target.value = ''
    },
    handleDrop(event) {
      this.isDragging = false
      const files = event.dataTransfer.files
      this.$emit('files-selected', files)
    }
  }
}
</script>

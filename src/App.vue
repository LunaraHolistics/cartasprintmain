<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Card Layout & Print Manager</h1>
        <p class="text-gray-600 mt-2">Organize suas cartas para impressão perfeita</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar - Configurações -->
        <div class="lg:col-span-1">
          <SettingsPanel 
            :settings="settings"
            :imageCount="images.length"
            :pageCount="pages.length"
            :stats="stats"
            :isGenerating="isGeneratingPDF"
            @update-settings="updateSettings"
            @generate-pdf="generatePDF"
            @export-settings="exportSettings"
            @clear-all="clearAll"
          />
        </div>

        <!-- Main Preview Area -->
        <div class="lg:col-span-3">
          <!-- Back Image Upload (if enabled) -->
          <div v-if="settings.includeBack" class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-bold mb-4">Imagem do Verso</h3>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input 
                @change="handleBackImageUpload"
                type="file"
                accept="image/*"
                class="hidden"
                ref="backImageInput"
              >
              <button 
                @click="$refs.backImageInput.click()"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Selecionar Imagem do Verso
              </button>
              <p v-if="backImage" class="mt-2 text-green-600">✓ Verso carregado</p>
            </div>
          </div>

          <!-- Image Upload Area -->
          <div v-if="images.length === 0" class="bg-white rounded-lg shadow p-6 mb-6">
            <ImageUploadArea @files-selected="handleImageUpload" />
          </div>

          <!-- Preview -->
          <div v-if="images.length > 0">
            <PagePreview :pages="pages" :settings="settings" />
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-lg shadow p-12 text-center">
            <p class="text-gray-500 text-lg">Nenhuma imagem carregada. Comece enviando suas cartas.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Error Toast -->
    <div v-if="errorMessage" class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
      {{ errorMessage }}
    </div>

    <!-- Success Toast -->
    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import ImageUploadArea from './ImageUploadArea.vue' // Caminho corrigido
import PagePreview from './PagePreview.vue'
import SettingsPanel from './SettingsPanel.vue'
import { calculateLayout, calculateLayoutStats, validateImages } from '/layoutEngine.js'
import { generatePDFFromPages, exportSettings as exportSettingsUtil } from '/pdfGenerator.js'

export default {
  name: 'App',
  components: {
    ImageUploadArea,
    PagePreview,
    SettingsPanel
  },
  data() {
    return {
      images: [],
      backImage: null,
      pages: [],
      stats: null,
      settings: {
        pageSize: 'A4',
        customWidth: 210,
        customHeight: 297,
        margin: 10,
        spacing: 5,
        includeBack: false
      },
      isGeneratingPDF: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  watch: {
    images: {
      handler() {
        this.calculateLayout()
      },
      deep: true
    },
    settings: {
      handler() {
        this.calculateLayout()
      },
      deep: true
    }
  },
  methods: {
    handleImageUpload(files) {
      for (let file of files) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.images.push({
            src: e.target.result,
            width: 0,
            height: 0
          })
          // Get image dimensions
          const img = new Image()
          img.onload = () => {
            const lastImage = this.images[this.images.length - 1]
            lastImage.width = img.naturalWidth
            lastImage.height = img.naturalHeight
            this.calculateLayout()
          }
          img.onerror = () => {
            this.showError('Erro ao carregar imagem')
            this.images.pop()
          }
          img.src = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    handleBackImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.backImage = e.target.result
        }
        reader.readAsDataURL(file)
      }
      event.target.value = ''
    },
    updateSettings(newSettings) {
      this.settings = { ...newSettings }
    },
    calculateLayout() {
      // Validar imagens
      const validation = validateImages(this.images)
      if (!validation.isValid) {
        this.pages = []
        this.stats = null
        return
      }

      // Calcular layout
      this.pages = calculateLayout(this.images, this.settings)
      
      // Calcular estatísticas
      if (this.pages.length > 0) {
        this.stats = calculateLayoutStats(this.pages, this.settings)
      } else {
        this.stats = null
      }
    },
    async generatePDF() {
      if (this.images.length === 0) {
        this.showError('Carregue pelo menos uma imagem antes de gerar o PDF')
        return
      }

      if (this.settings.includeBack && !this.backImage) {
        this.showError('Carregue a imagem do verso antes de gerar o PDF')
        return
      }

      this.isGeneratingPDF = true
      try {
        await generatePDFFromPages(this.pages, this.settings, this.backImage)
        this.showSuccess('PDF gerado com sucesso!')
      } catch (error) {
        console.error('Erro ao gerar PDF:', error)
        this.showError('Erro ao gerar PDF: ' + error.message)
      } finally {
        this.isGeneratingPDF = false
      }
    },
    exportSettings() {
      if (this.images.length === 0) {
        this.showError('Carregue pelo menos uma imagem antes de exportar')
        return
      }

      exportSettingsUtil(this.images, this.settings, this.backImage)
      this.showSuccess('Configurações exportadas com sucesso!')
    },
    clearAll() {
      if (confirm('Tem certeza que deseja limpar todas as imagens?')) {
        this.images = []
        this.backImage = null
        this.pages = []
        this.stats = null
        this.showSuccess('Tudo foi limpo')
      }
    },
    showError(message) {
      this.errorMessage = message
      setTimeout(() => {
        this.errorMessage = ''
      }, 5000)
    },
    showSuccess(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = ''
      }, 5000)
    }
  }
}
</script>

<style scoped>
</style>

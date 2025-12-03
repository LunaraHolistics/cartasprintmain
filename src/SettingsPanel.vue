<template>
  <div class="bg-white rounded-lg shadow p-6 sticky top-8">
    <h2 class="text-xl font-bold mb-4">Configurações</h2>
    
    <!-- Page Size Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Tamanho da Página</label>
      <select v-model="localSettings.pageSize" @change="updateSettings" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        <option value="A4">A4 (210 x 297 mm)</option>
        <option value="A3">A3 (297 x 420 mm)</option>
        <option value="custom">Personalizado</option>
      </select>
    </div>

    <!-- Custom Page Size -->
    <div v-if="localSettings.pageSize === 'custom'" class="mb-6">
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Largura (mm)</label>
        <input v-model.number="localSettings.customWidth" @change="updateSettings" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Altura (mm)</label>
        <input v-model.number="localSettings.customHeight" @change="updateSettings" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md">
      </div>
    </div>

    <!-- Margins -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Margem (mm)</label>
      <input v-model.number="localSettings.margin" @change="updateSettings" type="number" min="0" step="1" class="w-full px-3 py-2 border border-gray-300 rounded-md">
      <p class="text-xs text-gray-500 mt-1">Margem em todos os lados da página</p>
    </div>

    <!-- Spacing -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Espaço entre Cartas (mm)</label>
      <input v-model.number="localSettings.spacing" @change="updateSettings" type="number" min="0" step="1" class="w-full px-3 py-2 border border-gray-300 rounded-md">
      <p class="text-xs text-gray-500 mt-1">Espaço horizontal e vertical entre cartas</p>
    </div>

    <!-- Back Side Options -->
    <div class="mb-6 pb-6 border-b border-gray-200">
      <label class="flex items-center">
        <input v-model="localSettings.includeBack" @change="updateSettings" type="checkbox" class="rounded border-gray-300">
        <span class="ml-2 text-sm font-medium text-gray-700">Incluir Verso</span>
      </label>
      <p class="text-xs text-gray-500 mt-2">Adiciona páginas de verso com espelhamento de margens</p>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-2">
      <button 
        @click="$emit('generate-pdf')"
        :disabled="imageCount === 0 || isGenerating"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
      >
        {{ isGenerating ? 'Gerando PDF...' : 'Gerar PDF' }}
      </button>
      <button 
        @click="$emit('export-settings')"
        :disabled="imageCount === 0"
        class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
      >
        Exportar Config
      </button>
      <button 
        @click="$emit('clear-all')"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
      >
        Limpar Tudo
      </button>
    </div>

    <!-- Image Count and Stats -->
    <div class="mt-6 p-3 bg-blue-50 rounded-md">
      <p class="text-sm text-gray-700 mb-2">
        <strong>{{ imageCount }}</strong> carta(s) carregada(s)
      </p>
      <p v-if="pageCount > 0" class="text-sm text-gray-700">
        <strong>{{ pageCount }}</strong> página(s)
      </p>
      <p v-if="stats" class="text-sm text-gray-700 mt-2">
        Utilização: <strong>{{ stats.utilizationPercentage }}%</strong>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPanel',
  props: {
    settings: {
      type: Object,
      required: true
    },
    imageCount: {
      type: Number,
      default: 0
    },
    pageCount: {
      type: Number,
      default: 0
    },
    stats: {
      type: Object,
      default: null
    },
    isGenerating: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localSettings: { ...this.settings }
    }
  },
  watch: {
    settings: {
      handler(newVal) {
        this.localSettings = { ...newVal }
      },
      deep: true
    }
  },
  methods: {
    updateSettings() {
      this.$emit('update-settings', this.localSettings)
    }
  }
}
</script>

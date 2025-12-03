import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { generateBackPages } from './backPageGenerator.js'
import { generateCutGuides } from './cutGuides.js'

/**
 * Gera um PDF a partir dos elementos de página pré-visualizados
 * @param {Array} pages - Array de páginas com cartas organizadas
 * @param {Object} settings - Configurações de página e margens
 * @param {Array} backImageData - Dados da imagem do verso (opcional)
 * @returns {Promise<void>}
 */
export async function generatePDFFromPages(pages, settings, backImageData = null) {
  const pageDims = getPageDimensions(settings)
  
  // Criar PDF com as dimensões corretas
  const pdf = new jsPDF({
    orientation: pageDims.width > pageDims.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [pageDims.width, pageDims.height]
  })

  // Processar páginas de frente
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    if (pageIndex > 0) {
      pdf.addPage([pageDims.width, pageDims.height])
    }

    await addPageToPDF(pdf, pages[pageIndex], settings, pageDims)
  }

  // Processar páginas de verso se habilitado
  if (settings.includeBack && backImageData) {
    const backPages = generateBackPages(pages, backImageData, settings, pageDims)
    
    for (let pageIndex = 0; pageIndex < backPages.length; pageIndex++) {
      pdf.addPage([pageDims.width, pageDims.height])
      await addPageToPDF(pdf, backPages[pageIndex], settings, pageDims)
    }
  }

  // Salvar PDF
  pdf.save('card-layout.pdf')
}

/**
 * Adiciona uma página ao PDF
 * @param {jsPDF} pdf - Instância do jsPDF
 * @param {Array} cards - Array de cartas da página
 * @param {Object} settings - Configurações
 * @param {Object} pageDims - Dimensões da página
 */
async function addPageToPDF(pdf, cards, settings, pageDims) {
  for (let card of cards) {
    try {
      // Converter imagem para dados base64
      const imgData = await getImageData(card.src)
      
      // Calcular dimensões em mm
      const mmToPx = 3.78
      const xMm = card.x
      const yMm = card.y
      const widthMm = card.displayWidth
      const heightMm = card.displayHeight

      // Adicionar imagem ao PDF
      pdf.addImage(
        imgData,
        'JPEG',
        xMm,
        yMm,
        widthMm,
        heightMm
      )
    } catch (error) {
      console.error('Erro ao adicionar imagem ao PDF:', error)
    }
  }
}



/**
 * Obtém dados de imagem em base64
 * @param {string} src - Fonte da imagem (data URL ou URL)
 * @returns {Promise<string>} Dados da imagem em base64
 */
function getImageData(src) {
  return new Promise((resolve, reject) => {
    if (src.startsWith('data:')) {
      // Já é data URL
      resolve(src)
    } else {
      // Converter URL para data URL
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg'))
      }
      img.onerror = reject
      img.src = src
    }
  })
}

/**
 * Obtém as dimensões da página em mm
 * @param {Object} settings - Configurações
 * @returns {Object} Dimensões {width, height}
 */
function getPageDimensions(settings) {
  const sizes = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 }
  }

  if (settings.pageSize === 'custom') {
    return {
      width: settings.customWidth,
      height: settings.customHeight
    }
  }
  return sizes[settings.pageSize]
}

/**
 * Exporta configurações e dados para um arquivo JSON
 * @param {Array} images - Array de imagens
 * @param {Object} settings - Configurações
 * @param {string} backImageData - Dados da imagem do verso
 */
export function exportSettings(images, settings, backImageData) {
  const exportData = {
    timestamp: new Date().toISOString(),
    settings: {
      pageSize: settings.pageSize,
      customWidth: settings.customWidth,
      customHeight: settings.customHeight,
      margin: settings.margin,
      spacing: settings.spacing,
      includeBack: settings.includeBack
    },
    imageCount: images.length,
    hasBackImage: !!backImageData
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `card-layout-settings-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

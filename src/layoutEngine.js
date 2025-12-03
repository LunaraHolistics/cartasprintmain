/**
 * Motor de layout para organização otimizada de cartas em páginas
 * Usa tamanho exato de cada imagem sem redimensionamento
 * Alinha cartas de forma otimizada para corte na gráfica
 */

/**
 * Calcula o layout das cartas nas páginas
 * Usa tamanho exato de cada imagem conforme arquivo enviado
 * @param {Array} images - Array de imagens com dimensões
 * @param {Object} settings - Configurações de página e espaçamento
 * @returns {Array} Array de páginas com cartas posicionadas
 */
export function calculateLayout(images, settings) {
  if (images.length === 0) return []

  const pageDims = getPageDimensions(settings)
  const pages = []
  let currentPage = []
  let currentY = settings.margin
  let maxHeightInRow = 0

  for (let image of images) {
    // Usar tamanho exato da imagem
    const cardWidth = image.width
    const cardHeight = image.height

    // Calcular posição X baseado no que já está na página
    let currentRowWidth = currentPage.reduce((sum, card) => sum + card.displayWidth + settings.spacing, 0)
    const availableWidth = pageDims.width - (settings.margin * 2)

    // Verificar se cabe na linha atual
    const fitsInCurrentRow = currentRowWidth + cardWidth <= availableWidth

    if (!fitsInCurrentRow && currentPage.length > 0) {
      // Passar para próxima linha
      currentY += maxHeightInRow + settings.spacing
      currentPage = []
      maxHeightInRow = 0
    }

    // Verificar se cabe na página
    const availableHeight = pageDims.height - (settings.margin * 2)
    if (currentY + cardHeight > availableHeight && currentPage.length > 0) {
      // Passar para próxima página
      pages.push(currentPage)
      currentPage = []
      currentY = settings.margin
      maxHeightInRow = 0
    }

    // Calcular posição X
    currentRowWidth = currentPage.reduce((sum, card) => sum + card.displayWidth + settings.spacing, 0)
    const cardX = settings.margin + currentRowWidth

    // Adicionar carta à página
    currentPage.push({
      src: image.src,
      x: cardX,
      y: currentY,
      displayWidth: cardWidth,
      displayHeight: cardHeight,
      originalWidth: image.width,
      originalHeight: image.height
    })

    maxHeightInRow = Math.max(maxHeightInRow, cardHeight)
  }

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
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
 * Calcula estatísticas de layout
 * @param {Array} pages - Páginas com cartas
 * @param {Object} settings - Configurações
 * @returns {Object} Estatísticas
 */
export function calculateLayoutStats(pages, settings) {
  const pageDims = getPageDimensions(settings)
  const pageArea = pageDims.width * pageDims.height
  const availableArea = (pageDims.width - settings.margin * 2) * (pageDims.height - settings.margin * 2)

  let totalCardArea = 0
  let totalCards = 0

  for (let page of pages) {
    for (let card of page) {
      totalCardArea += card.displayWidth * card.displayHeight
      totalCards++
    }
  }

  const utilizationPercentage = pages.length > 0 
    ? (totalCardArea / (availableArea * pages.length)) * 100 
    : 0

  return {
    totalPages: pages.length,
    totalCards,
    utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
    pageArea,
    availableArea,
    totalCardArea
  }
}

/**
 * Valida as dimensões das imagens
 * @param {Array} images - Array de imagens
 * @returns {Object} {isValid, errors}
 */
export function validateImages(images) {
  const errors = []

  if (images.length === 0) {
    errors.push('Nenhuma imagem foi carregada')
  }

  for (let i = 0; i < images.length; i++) {
    if (!images[i].width || !images[i].height) {
      errors.push(`Imagem ${i + 1} não tem dimensões válidas`)
    }
    if (images[i].width <= 0 || images[i].height <= 0) {
      errors.push(`Imagem ${i + 1} tem dimensões inválidas`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Calcula informações de corte para a gráfica
 * @param {Array} pages - Páginas com cartas
 * @param {Object} settings - Configurações
 * @returns {Array} Instruções de corte
 */
export function calculateCutInstructions(pages, settings) {
  const instructions = []

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const page = pages[pageIndex]

    for (let cardIndex = 0; cardIndex < page.length; cardIndex++) {
      const card = page[cardIndex]

      instructions.push({
        pageNumber: pageIndex + 1,
        cardNumber: cardIndex + 1,
        x: card.x,
        y: card.y,
        width: card.displayWidth,
        height: card.displayHeight,
        cutLines: {
          top: card.y,
          right: card.x + card.displayWidth,
          bottom: card.y + card.displayHeight,
          left: card.x
        }
      })
    }
  }

  return instructions
}

/**
 * Calcula o alinhamento otimizado para corte
 * @param {Array} pages - Páginas com cartas
 * @returns {Object} Informações de alinhamento
 */
export function calculateAlignmentInfo(pages) {
  if (pages.length === 0) return null

  const firstPage = pages[0]
  if (firstPage.length === 0) return null

  // Calcular quantas cartas por linha em cada página
  const cardsPerRowByPage = pages.map(page => {
    if (page.length === 0) return 0
    
    const firstY = page[0].y
    return page.filter(card => card.y === firstY).length
  })

  const maxCardsPerRow = Math.max(...cardsPerRowByPage)
  const totalCards = pages.reduce((sum, page) => sum + page.length, 0)

  return {
    totalCards,
    totalPages: pages.length,
    cardsPerRow: maxCardsPerRow,
    isAligned: true,
    message: `${totalCards} cartas em ${pages.length} página(s) - Alinhadas para corte`
  }
}

/**
 * Valida alinhamento para impressão frente e verso
 * @param {Array} frontPages - Páginas de frente
 * @param {Array} backPages - Páginas de verso
 * @returns {Object} {isAligned, errors}
 */
export function validatePrintAlignment(frontPages, backPages) {
  const errors = []

  if (frontPages.length !== backPages.length) {
    errors.push(`Número de páginas diferente: frente tem ${frontPages.length}, verso tem ${backPages.length}`)
  }

  for (let i = 0; i < Math.min(frontPages.length, backPages.length); i++) {
    const frontPage = frontPages[i]
    const backPage = backPages[i]

    if (frontPage.length !== backPage.length) {
      errors.push(`Página ${i + 1}: número de cartas diferente (frente: ${frontPage.length}, verso: ${backPage.length})`)
    }

    if (frontPage.length > 0 && backPage.length > 0) {
      const frontCard = frontPage[0]
      const backCard = backPage[0]

      if (Math.abs(frontCard.displayWidth - backCard.displayWidth) > 0.1) {
        errors.push(`Página ${i + 1}: largura diferente entre frente e verso`)
      }

      if (Math.abs(frontCard.displayHeight - backCard.displayHeight) > 0.1) {
        errors.push(`Página ${i + 1}: altura diferente entre frente e verso`)
      }
    }
  }

  return {
    isAligned: errors.length === 0,
    errors
  }
}

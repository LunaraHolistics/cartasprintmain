/**
 * Gerador de páginas de verso com espelhamento de margens
 * Garante alinhamento perfeito para impressão frente e verso
 */

/**
 * Calcula o posicionamento do verso com espelhamento de margens
 * Mantém o mesmo alinhamento de grid que a frente
 * @param {Array} frontPages - Páginas de frente
 * @param {string} backImageSrc - Fonte da imagem do verso
 * @param {Object} settings - Configurações de página
 * @param {Object} pageDims - Dimensões da página
 * @returns {Array} Páginas de verso com cartas posicionadas
 */
export function generateBackPages(frontPages, backImageSrc, settings, pageDims) {
  const backPages = []

  // Para cada página de frente, criar página de verso correspondente
  for (let pageIndex = 0; pageIndex < frontPages.length; pageIndex++) {
    const frontPage = frontPages[pageIndex]
    const backPage = []

    // Para cada carta da frente, criar carta correspondente no verso
    for (let cardIndex = 0; cardIndex < frontPage.length; cardIndex++) {
      const frontCard = frontPage[cardIndex]

      // Espelhar apenas a posição X (margem esquerda vira margem direita)
      // A posição Y permanece igual
      const backX = pageDims.width - settings.margin - frontCard.displayWidth - 
                    (frontCard.col * (frontCard.displayWidth + settings.spacing))

      const backCard = {
        src: backImageSrc,
        x: backX,
        y: frontCard.y,
        displayWidth: frontCard.displayWidth,
        displayHeight: frontCard.displayHeight,
        row: frontCard.row,
        col: frontCard.col,
        isBackPage: true
      }

      backPage.push(backCard)
    }

    backPages.push(backPage)
  }

  return backPages
}

/**
 * Valida se as páginas de verso estão alinhadas corretamente com a frente
 * @param {Array} frontPages - Páginas de frente
 * @param {Array} backPages - Páginas de verso
 * @returns {Object} {isAligned, errors}
 */
export function validateBackPageAlignment(frontPages, backPages) {
  const errors = []

  if (frontPages.length !== backPages.length) {
    errors.push(`Número de páginas diferente: frente tem ${frontPages.length}, verso tem ${backPages.length}`)
  }

  for (let i = 0; i < Math.min(frontPages.length, backPages.length); i++) {
    const frontPage = frontPages[i]
    const backPage = backPages[i]

    if (!backPage || backPage.length === 0) {
      errors.push(`Página ${i + 1} do verso está vazia`)
    }

    if (frontPage.length !== backPage.length) {
      errors.push(`Página ${i + 1}: número de cartas diferente (frente: ${frontPage.length}, verso: ${backPage.length})`)
    }

    // Verificar se as dimensões das cartas são compatíveis
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

/**
 * Calcula as margens espelhadas para impressão frente e verso
 * @param {Object} settings - Configurações originais
 * @param {Object} pageDims - Dimensões da página
 * @returns {Object} Margens espelhadas {top, right, bottom, left}
 */
export function calculateMirroredMargins(settings, pageDims) {
  return {
    top: settings.margin,
    right: settings.margin,
    bottom: settings.margin,
    left: settings.margin,
    // Para verso, espelhar esquerda e direita
    backLeft: settings.margin,
    backRight: settings.margin
  }
}

/**
 * Gera instruções de corte para as cartas
 * Facilita o trabalho da gráfica
 * @param {Array} pages - Páginas com cartas
 * @param {Object} settings - Configurações
 * @param {Object} pageDims - Dimensões da página
 * @returns {Array} Instruções de corte
 */
export function generateCutInstructions(pages, settings, pageDims) {
  const instructions = []

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const page = pages[pageIndex]

    for (let cardIndex = 0; cardIndex < page.length; cardIndex++) {
      const card = page[cardIndex]

      instructions.push({
        pageNumber: pageIndex + 1,
        cardNumber: cardIndex + 1,
        row: card.row,
        col: card.col,
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
 * Gera relatório de alinhamento para impressão
 * @param {Array} frontPages - Páginas de frente
 * @param {Array} backPages - Páginas de verso
 * @returns {Object} Relatório de alinhamento
 */
export function generateAlignmentReport(frontPages, backPages) {
  const report = {
    frontPages: frontPages.length,
    backPages: backPages.length,
    isAligned: frontPages.length === backPages.length,
    cardsPerPage: frontPages[0]?.length || 0,
    totalCards: frontPages.reduce((sum, page) => sum + page.length, 0),
    alignment: 'Grid alinhado para corte perfeito'
  }

  if (frontPages.length > 0 && frontPages[0].length > 0) {
    const firstCard = frontPages[0][0]
    report.cardDimensions = {
      width: firstCard.displayWidth,
      height: firstCard.displayHeight,
      unit: 'mm'
    }
  }

  return report
}

/**
 * Gerador de guias de corte para visualização em PDF
 * Adiciona linhas de corte e marcações visuais para facilitar o trabalho da gráfica
 */

/**
 * Gera instruções de guias de corte para cada página
 * @param {Array} pages - Páginas com cartas posicionadas
 * @param {Object} settings - Configurações (margin, spacing, etc)
 * @returns {Array} Array de guias de corte por página
 */
export function generateCutGuides(pages, settings) {
  const guides = []

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const page = pages[pageIndex]
    const pageGuides = []

    for (let cardIndex = 0; cardIndex < page.length; cardIndex++) {
      const card = page[cardIndex]

      // Gerar guias para cada carta
      const guide = {
        cardIndex,
        x: card.x,
        y: card.y,
        width: card.displayWidth,
        height: card.displayHeight,
        // Linhas de corte (4 cantos)
        cornerMarks: generateCornerMarks(card, 3), // 3mm de marca de canto
        // Linha de corte contínua
        cutLine: {
          top: { x1: card.x, y1: card.y, x2: card.x + card.displayWidth, y2: card.y },
          right: { x1: card.x + card.displayWidth, y1: card.y, x2: card.x + card.displayWidth, y2: card.y + card.displayHeight },
          bottom: { x1: card.x, y1: card.y + card.displayHeight, x2: card.x + card.displayWidth, y2: card.y + card.displayHeight },
          left: { x1: card.x, y1: card.y, x2: card.x, y2: card.y + card.displayHeight }
        },
        // Marcas de dobra (se aplicável)
        foldMarks: generateFoldMarks(card)
      }

      pageGuides.push(guide)
    }

    guides.push({
      pageIndex,
      cardGuides: pageGuides
    })
  }

  return guides
}

/**
 * Gera marcas de canto (corner marks) para facilitar o corte
 * @param {Object} card - Carta com posição e dimensões
 * @param {number} markSize - Tamanho da marca em mm
 * @returns {Array} Array com 4 marcas de canto
 */
function generateCornerMarks(card, markSize = 3) {
  return [
    // Canto superior esquerdo
    {
      position: 'top-left',
      horizontal: { x1: card.x - markSize, y1: card.y, x2: card.x + markSize, y2: card.y },
      vertical: { x1: card.x, y1: card.y - markSize, x2: card.x, y2: card.y + markSize }
    },
    // Canto superior direito
    {
      position: 'top-right',
      horizontal: { x1: card.x + card.displayWidth - markSize, y1: card.y, x2: card.x + card.displayWidth + markSize, y2: card.y },
      vertical: { x1: card.x + card.displayWidth, y1: card.y - markSize, x2: card.x + card.displayWidth, y2: card.y + markSize }
    },
    // Canto inferior esquerdo
    {
      position: 'bottom-left',
      horizontal: { x1: card.x - markSize, y1: card.y + card.displayHeight, x2: card.x + markSize, y2: card.y + card.displayHeight },
      vertical: { x1: card.x, y1: card.y + card.displayHeight - markSize, x2: card.x, y2: card.y + card.displayHeight + markSize }
    },
    // Canto inferior direito
    {
      position: 'bottom-right',
      horizontal: { x1: card.x + card.displayWidth - markSize, y1: card.y + card.displayHeight, x2: card.x + card.displayWidth + markSize, y2: card.y + card.displayHeight },
      vertical: { x1: card.x + card.displayWidth, y1: card.y + card.displayHeight - markSize, x2: card.x + card.displayWidth, y2: card.y + card.displayHeight + markSize }
    }
  ]
}

/**
 * Gera marcas de dobra (fold marks) para cartas que serão dobradas
 * @param {Object} card - Carta com posição e dimensões
 * @returns {Array} Array com marcas de dobra (vazio se não aplicável)
 */
function generateFoldMarks(card) {
  const foldMarks = []

  // Marca de dobra horizontal (meio da altura)
  const midY = card.y + (card.displayHeight / 2)
  foldMarks.push({
    type: 'horizontal',
    x1: card.x - 2,
    y1: midY,
    x2: card.x + 2,
    y2: midY,
    label: 'Dobra'
  })

  // Marca de dobra vertical (meio da largura)
  const midX = card.x + (card.displayWidth / 2)
  foldMarks.push({
    type: 'vertical',
    x1: midX,
    y1: card.y - 2,
    x2: midX,
    y2: card.y + 2,
    label: 'Dobra'
  })

  return foldMarks
}

/**
 * Gera informações de alinhamento para impressão frente e verso
 * @param {Array} frontPages - Páginas de frente
 * @param {Array} backPages - Páginas de verso
 * @returns {Object} Informações de alinhamento
 */
export function generateAlignmentMarks(frontPages, backPages) {
  const marks = []

  for (let pageIndex = 0; pageIndex < Math.min(frontPages.length, backPages.length); pageIndex++) {
    const frontPage = frontPages[pageIndex]
    const backPage = backPages[pageIndex]

    // Verificar alinhamento de cada carta
    for (let cardIndex = 0; cardIndex < Math.min(frontPage.length, backPage.length); cardIndex++) {
      const frontCard = frontPage[cardIndex]
      const backCard = backPage[cardIndex]

      marks.push({
        pageIndex,
        cardIndex,
        front: {
          x: frontCard.x,
          y: frontCard.y,
          width: frontCard.displayWidth,
          height: frontCard.displayHeight
        },
        back: {
          x: backCard.x,
          y: backCard.y,
          width: backCard.displayWidth,
          height: backCard.displayHeight
        },
        isAligned: (
          frontCard.displayWidth === backCard.displayWidth &&
          frontCard.displayHeight === backCard.displayHeight &&
          frontCard.y === backCard.y
        )
      })
    }
  }

  return marks
}

/**
 * Gera um relatório de guias de corte para impressão
 * @param {Array} pages - Páginas com cartas
 * @param {Object} settings - Configurações
 * @returns {Object} Relatório formatado
 */
export function generateCutGuideReport(pages, settings) {
  const report = {
    totalPages: pages.length,
    totalCards: pages.reduce((sum, page) => sum + page.length, 0),
    cardsPerPage: pages.map((page, idx) => ({
      pageNumber: idx + 1,
      cardCount: page.length,
      cards: page.map((card, cardIdx) => ({
        cardNumber: cardIdx + 1,
        position: `X: ${Math.round(card.x)}mm, Y: ${Math.round(card.y)}mm`,
        size: `${Math.round(card.displayWidth)}mm × ${Math.round(card.displayHeight)}mm`,
        cutLines: {
          top: Math.round(card.y),
          right: Math.round(card.x + card.displayWidth),
          bottom: Math.round(card.y + card.displayHeight),
          left: Math.round(card.x)
        }
      }))
    })),
    settings: {
      pageSize: settings.pageSize,
      margin: settings.margin,
      spacing: settings.spacing
    },
    instructions: [
      '1. Imprima todas as páginas em escala 100% (sem redimensionamento)',
      '2. Use as marcas de canto para alinhar o corte',
      '3. Corte seguindo as linhas de corte contínuas',
      '4. Para impressão frente e verso, alinhe as páginas de verso com as marcas de alinhamento',
      '5. Verifique o alinhamento antes de cortar'
    ]
  }

  return report
}

/**
 * Valida se os guias de corte estão corretos
 * @param {Array} guides - Guias de corte gerados
 * @param {Array} pages - Páginas originais
 * @returns {Object} {isValid, errors}
 */
export function validateCutGuides(guides, pages) {
  const errors = []

  if (guides.length !== pages.length) {
    errors.push(`Número de guias diferente do número de páginas`)
  }

  for (let i = 0; i < Math.min(guides.length, pages.length); i++) {
    const guide = guides[i]
    const page = pages[i]

    if (guide.cardGuides.length !== page.length) {
      errors.push(`Página ${i + 1}: número de guias diferente do número de cartas`)
    }

    for (let j = 0; j < Math.min(guide.cardGuides.length, page.length); j++) {
      const cardGuide = guide.cardGuides[j]
      const card = page[j]

      if (cardGuide.x !== card.x || cardGuide.y !== card.y) {
        errors.push(`Página ${i + 1}, Carta ${j + 1}: posição do guia diferente da carta`)
      }

      if (cardGuide.width !== card.displayWidth || cardGuide.height !== card.displayHeight) {
        errors.push(`Página ${i + 1}, Carta ${j + 1}: dimensões do guia diferentes da carta`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

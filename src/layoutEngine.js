/**
 * Motor de layout para organização otimizada de cartas em páginas
 * A nova versão usa um tamanho de carta fixo (em milímetros) para o layout,
 * baseado na proporção da primeira imagem carregada, garantindo que todas
 * as cartas tenham o mesmo tamanho na folha de impressão (mm).
 */

// Dimensões de carta padrão em MILÍMETROS (pode ser ajustado)
// Esta é uma suposição comum para cartas de oráculo/tarot.
const DEFAULT_CARD_WIDTH_MM = 63;
const DEFAULT_CARD_HEIGHT_MM = 88;

/**
 * Calcula o layout das cartas nas páginas
 * @param {Array} images - Array de imagens com dimensões em pixels (agora usado apenas para proporção)
 * @param {Object} settings - Configurações de página e espaçamento
 * @param {number} targetWidthPx - Largura da primeira imagem em pixels (padrão para proporção)
 * @param {number} targetHeightPx - Altura da primeira imagem em pixels (padrão para proporção)
 * @returns {Array} Array de páginas com cartas posicionadas
 */
export function calculateLayout(images, settings, targetWidthPx = 0, targetHeightPx = 0) {
    if (images.length === 0 || targetWidthPx === 0 || targetHeightPx === 0) return []

    const pageDims = getPageDimensions(settings)
    const pages = []
    let currentPage = []
    let currentY = settings.margin
    let maxHeightInRow = 0

    // 1. Definir o tamanho de LAYOUT em MILÍMETROS (mm)
    // Se a proporção da imagem carregada não for a padrão (ex: retrato),
    // ajustamos o tamanho de saída para manter essa proporção.
    
    // Proporção da primeira imagem carregada (Pixel Height / Pixel Width)
    const targetAspectRatio = targetHeightPx / targetWidthPx;

    let cardWidthMM = DEFAULT_CARD_WIDTH_MM;
    let cardHeightMM = DEFAULT_CARD_HEIGHT_MM;

    // Se a imagem for paisagem (wide) ou outra proporção, ajustamos a altura ou largura
    if (targetAspectRatio > 1) { // Retrato (padrão 88/63 = 1.39)
        // Usa a largura padrão e recalcula a altura
        cardHeightMM = cardWidthMM * targetAspectRatio; 
    } else if (targetAspectRatio < 1) { // Paisagem
        // Troca largura e altura (Ex: 88mm de largura, 63mm de altura)
        cardWidthMM = DEFAULT_CARD_HEIGHT_MM;
        cardHeightMM = DEFAULT_CARD_WIDTH_MM;
    }
    // NOTA: Se o cliente quiser que a carta SEMPRE seja 63x88mm, independentemente
    // da proporção da imagem, as linhas acima devem ser removidas.
    
    // Assegurar que os tamanhos calculados não excedam o limite da página
    if (cardWidthMM > pageDims.width - settings.margin * 2 || cardHeightMM > pageDims.height - settings.margin * 2) {
        console.error("Card dimensions are too large for the page size.");
        return [];
    }


    for (let image of images) {
        // 2. Usar o tamanho de layout calculado em MM
        const cardWidth = cardWidthMM
        const cardHeight = cardHeightMM

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

        // Se passar para a próxima linha, recalcula currentRowWidth (será 0)
        currentRowWidth = currentPage.reduce((sum, card) => sum + card.displayWidth + settings.spacing, 0)

        // 3. Verificar se cabe na página APÓS tentar a próxima linha
        const availableHeight = pageDims.height - (settings.margin * 2)
        
        // Se a carta é a primeira da nova linha E não couber na altura
        if (currentY + cardHeight > availableHeight && (currentPage.length === 0 || !fitsInCurrentRow)) {
            // Passar para próxima página
            pages.push(currentPage)
            currentPage = []
            currentY = settings.margin
            maxHeightInRow = 0
        }
        
        // 4. Calcular posição X (novamente, se mudou de página)
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
        
        // Verifica se as dimensões de layout são iguais entre frente e verso
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

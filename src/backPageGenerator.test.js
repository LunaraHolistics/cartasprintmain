import { describe, it, expect } from 'vitest'
import { 
  generateBackPages, 
  validateBackPageAlignment, 
  calculateMirroredMargins,
  generateCutInstructions
} from '../backPageGenerator.js'

describe('Back Page Generator', () => {
  describe('generateBackPages', () => {
    it('deve gerar uma página de verso para cada página de frente', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, x: 10, y: 10, col: 0 }],
        [{ displayWidth: 50, displayHeight: 50, x: 10, y: 10, col: 0 }]
      ]
      const settings = { margin: 10, spacing: 5 }
      const pageDims = { width: 210, height: 297 }

      const backPages = generateBackPages(frontPages, 'back.jpg', settings, pageDims)

      expect(backPages.length).toBe(2)
      expect(backPages[0].length).toBe(1)
      expect(backPages[1].length).toBe(1)
    })

    it('deve espelhar a posição X das cartas', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, x: 10, y: 10, col: 0 }]
      ]
      const settings = { margin: 10, spacing: 5 }
      const pageDims = { width: 210, height: 297 }

      const backPages = generateBackPages(frontPages, 'back.jpg', settings, pageDims)
      const backCard = backPages[0][0]

      // X deve ser espelhado
      expect(backCard.x).not.toBe(frontPages[0][0].x)
    })

    it('deve manter a posição Y igual', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, x: 10, y: 10, col: 0 }]
      ]
      const settings = { margin: 10, spacing: 5 }
      const pageDims = { width: 210, height: 297 }

      const backPages = generateBackPages(frontPages, 'back.jpg', settings, pageDims)
      const backCard = backPages[0][0]

      expect(backCard.y).toBe(frontPages[0][0].y)
    })

    it('deve manter as dimensões da carta iguais', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, x: 10, y: 10, col: 0 }]
      ]
      const settings = { margin: 10, spacing: 5 }
      const pageDims = { width: 210, height: 297 }

      const backPages = generateBackPages(frontPages, 'back.jpg', settings, pageDims)
      const backCard = backPages[0][0]

      expect(backCard.displayWidth).toBe(50)
      expect(backCard.displayHeight).toBe(50)
    })

    it('deve marcar cartas como isBackPage', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, x: 10, y: 10, col: 0 }]
      ]
      const settings = { margin: 10, spacing: 5 }
      const pageDims = { width: 210, height: 297 }

      const backPages = generateBackPages(frontPages, 'back.jpg', settings, pageDims)
      const backCard = backPages[0][0]

      expect(backCard.isBackPage).toBe(true)
    })
  })

  describe('validateBackPageAlignment', () => {
    it('deve validar alinhamento correto', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, col: 0 }]
      ]
      const backPages = [
        [{ displayWidth: 50, displayHeight: 50, col: 0 }]
      ]

      const result = validateBackPageAlignment(frontPages, backPages)

      expect(result.isAligned).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('deve detectar número diferente de páginas', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, col: 0 }],
        [{ displayWidth: 50, displayHeight: 50, col: 0 }]
      ]
      const backPages = [
        [{ displayWidth: 50, displayHeight: 50, col: 0 }]
      ]

      const result = validateBackPageAlignment(frontPages, backPages)

      expect(result.isAligned).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('deve detectar página de verso vazia', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, col: 0 }]
      ]
      const backPages = [[]]

      const result = validateBackPageAlignment(frontPages, backPages)

      expect(result.isAligned).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('deve detectar dimensões diferentes', () => {
      const frontPages = [
        [{ displayWidth: 50, displayHeight: 50, col: 0 }]
      ]
      const backPages = [
        [{ displayWidth: 60, displayHeight: 50, col: 0 }]
      ]

      const result = validateBackPageAlignment(frontPages, backPages)

      expect(result.isAligned).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('calculateMirroredMargins', () => {
    it('deve calcular margens espelhadas', () => {
      const settings = { margin: 10 }
      const pageDims = { width: 210, height: 297 }

      const margins = calculateMirroredMargins(settings, pageDims)

      expect(margins.top).toBe(10)
      expect(margins.right).toBe(10)
      expect(margins.bottom).toBe(10)
      expect(margins.left).toBe(10)
      expect(margins.backLeft).toBe(10)
      expect(margins.backRight).toBe(10)
    })

    it('deve respeitar diferentes valores de margem', () => {
      const settings = { margin: 15 }
      const pageDims = { width: 210, height: 297 }

      const margins = calculateMirroredMargins(settings, pageDims)

      expect(margins.top).toBe(15)
      expect(margins.left).toBe(15)
      expect(margins.backRight).toBe(15)
    })
  })

  describe('generateCutInstructions', () => {
    it('deve gerar instruções de corte para cada carta', () => {
      const pages = [
        [
          { x: 10, y: 10, displayWidth: 50, displayHeight: 50 },
          { x: 65, y: 10, displayWidth: 50, displayHeight: 50 }
        ]
      ]
      const settings = { margin: 10, spacing: 5 }
      const pageDims = { width: 210, height: 297 }

      const instructions = generateCutInstructions(pages, settings, pageDims)

      expect(instructions.length).toBe(2)
      expect(instructions[0].pageNumber).toBe(1)
      expect(instructions[0].cardNumber).toBe(1)
      expect(instructions[1].cardNumber).toBe(2)
    })

    it('deve incluir linhas de corte corretas', () => {
      const pages = [
        [{ x: 10, y: 10, displayWidth: 50, displayHeight: 50 }]
      ]
      const settings = { margin: 10, spacing: 5 }
      const pageDims = { width: 210, height: 297 }

      const instructions = generateCutInstructions(pages, settings, pageDims)
      const instruction = instructions[0]

      expect(instruction.cutLines.top).toBe(10)
      expect(instruction.cutLines.left).toBe(10)
      expect(instruction.cutLines.right).toBe(60)
      expect(instruction.cutLines.bottom).toBe(60)
    })

    it('deve processar múltiplas páginas', () => {
      const pages = [
        [{ x: 10, y: 10, displayWidth: 50, displayHeight: 50 }],
        [{ x: 10, y: 10, displayWidth: 50, displayHeight: 50 }]
      ]
      const settings = { margin: 10, spacing: 5 }
      const pageDims = { width: 210, height: 297 }

      const instructions = generateCutInstructions(pages, settings, pageDims)

      expect(instructions.length).toBe(2)
      expect(instructions[0].pageNumber).toBe(1)
      expect(instructions[1].pageNumber).toBe(2)
    })
  })
})

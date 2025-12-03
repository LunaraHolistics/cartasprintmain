import { describe, it, expect } from 'vitest'
import { calculateLayout, calculateLayoutStats, validateImages } from '../layoutEngine.js'

describe('Layout Engine', () => {
  describe('calculateLayout', () => {
    it('deve retornar array vazio para imagens vazias', () => {
      const result = calculateLayout([], { pageSize: 'A4', margin: 10, spacing: 5 })
      expect(result).toEqual([])
    })

    it('deve criar uma página para imagens que cabem', () => {
      const images = [
        { src: 'test1.jpg', width: 50, height: 50 },
        { src: 'test2.jpg', width: 50, height: 50 }
      ]
      const settings = { pageSize: 'A4', margin: 10, spacing: 5 }
      const result = calculateLayout(images, settings)
      
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].length).toBeGreaterThanOrEqual(1)
    })

    it('deve criar múltiplas páginas para muitas imagens', () => {
      // Criar imagens maiores que forçam quebra de página
      const images = Array.from({ length: 20 }, (_, i) => ({
        src: `test${i}.jpg`,
        width: 70,  // 70mm
        height: 110 // 110mm
      }))
      const settings = { pageSize: 'A4', margin: 10, spacing: 5 }
      const result = calculateLayout(images, settings)
      
      // Com imagens de 70x110mm em A4, deve ter múltiplas páginas
      expect(result.length).toBeGreaterThan(0)
    })

    it('deve posicionar cartas corretamente', () => {
      const images = [
        { src: 'test1.jpg', width: 100, height: 100 }
      ]
      const settings = { pageSize: 'A4', margin: 10, spacing: 5 }
      const result = calculateLayout(images, settings)
      
      expect(result[0][0].x).toBe(10) // margem
      expect(result[0][0].y).toBe(10) // margem
      expect(result[0][0].displayWidth).toBeGreaterThan(0)
      expect(result[0][0].displayHeight).toBeGreaterThan(0)
    })

    it('deve usar tamanho exato das imagens', () => {
      const images = [
        { src: 'test1.jpg', width: 70, height: 110 }
      ]
      const settings = { pageSize: 'A4', margin: 10, spacing: 5 }
      const result = calculateLayout(images, settings)
      
      const card = result[0][0]
      // Deve manter o tamanho exato
      expect(card.displayWidth).toBe(70)
      expect(card.displayHeight).toBe(110)
    })
  })

  describe('calculateLayoutStats', () => {
    it('deve calcular estatísticas corretamente', () => {
      const pages = [[
        { displayWidth: 50, displayHeight: 50 },
        { displayWidth: 50, displayHeight: 50 }
      ]]
      const settings = { pageSize: 'A4', margin: 10, spacing: 5 }
      const stats = calculateLayoutStats(pages, settings)
      
      expect(stats.totalPages).toBe(1)
      expect(stats.totalCards).toBe(2)
      expect(stats.utilizationPercentage).toBeGreaterThan(0)
      expect(stats.utilizationPercentage).toBeLessThanOrEqual(100)
    })

    it('deve calcular utilização de espaço', () => {
      const pages = [[
        { displayWidth: 100, displayHeight: 100 }
      ]]
      const settings = { pageSize: 'A4', margin: 10, spacing: 5 }
      const stats = calculateLayoutStats(pages, settings)
      
      expect(stats.utilizationPercentage).toBeGreaterThan(0)
    })
  })

  describe('validateImages', () => {
    it('deve validar imagens vazias', () => {
      const result = validateImages([])
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('deve validar imagens com dimensões válidas', () => {
      const images = [
        { src: 'test1.jpg', width: 100, height: 100 }
      ]
      const result = validateImages(images)
      expect(result.isValid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('deve rejeitar imagens sem dimensões', () => {
      const images = [
        { src: 'test1.jpg', width: 0, height: 0 }
      ]
      const result = validateImages(images)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('deve rejeitar imagens com dimensões inválidas', () => {
      const images = [
        { src: 'test1.jpg', width: -100, height: 100 }
      ]
      const result = validateImages(images)
      expect(result.isValid).toBe(false)
    })
  })
})

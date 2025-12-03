# Exemplo Prático: Baralho Cigano de 36 Cartas

## Cenário

Você tem um **baralho cigano com 36 cartas** e quer:
1. Organizar todas as 36 cartas em páginas para impressão
2. Usar o tamanho exato de cada carta (70 × 110 mm)
3. Adicionar um verso com a mesma imagem para todas as cartas
4. Gerar um PDF pronto para a gráfica cortar e montar

## Passo a Passo

### 1. Preparar as Imagens

**Frente (36 arquivos):**
- `carta_01.png` (70 × 110 mm)
- `carta_02.png` (70 × 110 mm)
- ...
- `carta_36.png` (70 × 110 mm)

**Verso (1 arquivo):**
- `verso.png` (70 × 110 mm)

### 2. Configurar o App

| Configuração | Valor |
|--------------|-------|
| **Tamanho de Página** | A4 (210 × 297 mm) |
| **Margem** | 10 mm |
| **Espaço entre Cartas** | 5 mm (margem de corte) |
| **Incluir Verso** | ✅ Sim |

### 3. Cálculo Automático do Layout

#### Página de Frente

Com A4 (210 × 297 mm), margem 10 mm e espaço 5 mm:

**Espaço disponível:**
- Largura: 210 - (10 × 2) = 190 mm
- Altura: 297 - (10 × 2) = 277 mm

**Cartas por linha:**
- Cada carta: 70 mm
- Espaço entre: 5 mm
- Cálculo: (70 + 5) × n ≤ 190 mm
- **Resultado: 2 cartas por linha**

**Linhas por página:**
- Cada carta: 110 mm
- Espaço entre: 5 mm
- Cálculo: (110 + 5) × n ≤ 277 mm
- **Resultado: 2 linhas por página**

**Cartas por página:**
- 2 cartas/linha × 2 linhas = **4 cartas por página**

**Total de páginas:**
- 36 cartas ÷ 4 cartas/página = **9 páginas de frente**

#### Página de Verso

- **9 páginas de verso** (uma para cada página de frente)
- Cada página terá **4 cópias da mesma imagem de verso**
- Alinhadas exatamente com as cartas da frente (espelhamento de margens)

### 4. Resultado Final do PDF

```
📄 card-layout.pdf (18 páginas)

Páginas 1-9: FRENTE
├─ Página 1: Cartas 01-04
├─ Página 2: Cartas 05-08
├─ Página 3: Cartas 09-12
├─ Página 4: Cartas 13-16
├─ Página 5: Cartas 17-20
├─ Página 6: Cartas 21-24
├─ Página 7: Cartas 25-28
├─ Página 8: Cartas 29-32
└─ Página 9: Cartas 33-36

Páginas 10-18: VERSO
├─ Página 10: 4 × Verso (alinhado com Página 1)
├─ Página 11: 4 × Verso (alinhado com Página 2)
├─ Página 12: 4 × Verso (alinhado com Página 3)
├─ Página 13: 4 × Verso (alinhado com Página 4)
├─ Página 14: 4 × Verso (alinhado com Página 5)
├─ Página 15: 4 × Verso (alinhado com Página 6)
├─ Página 16: 4 × Verso (alinhado com Página 7)
├─ Página 17: 4 × Verso (alinhado com Página 8)
└─ Página 18: 4 × Verso (alinhado com Página 9)
```

### 5. Instruções de Impressão e Corte

#### Impressão

1. **Imprima as páginas 1-9 (frente)** em papel de 250 gsm
   - Escala: 100% (sem redimensionamento)
   - Qualidade: Máxima

2. **Recoloque o papel na impressora** (com as páginas impressas viradas para cima)

3. **Imprima as páginas 10-18 (verso)**
   - Escala: 100% (sem redimensionamento)
   - Qualidade: Máxima

#### Corte

1. **Deixe o papel secar** por 5 minutos após impressão

2. **Use as marcas de corte** (linhas de 5 mm entre as cartas) como guia

3. **Corte com precisão:**
   - Use um cortador de papel profissional ou tesoura afiada
   - Siga as linhas de corte
   - Cada página rende 4 cartas completas

4. **Resultado:**
   - 36 cartas frente e verso
   - Tamanho exato: 70 × 110 mm
   - Pronto para usar ou vender

### 6. Visualização do Layout (Página 1)

```
┌─────────────────────────────────────────────────────┐
│ Margem 10mm                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │  Carta 01 (70×110)  │  │  Carta 02 (70×110)  │  │
│  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  │
│         5mm espaço              5mm espaço         │
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │  Carta 03 (70×110)  │  │  Carta 04 (70×110)  │  │
│  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  │
│                                            Margem   │
└─────────────────────────────────────────────────────┘
```

### 7. Verso Espelhado (Página 10)

```
┌─────────────────────────────────────────────────────┐
│ Margem 10mm (espelhada)                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │  Verso (70×110)     │  │  Verso (70×110)     │  │
│  │  (alinhado com      │  │  (alinhado com      │  │
│  │   Carta 01)         │  │   Carta 02)         │  │
│  └─────────────────────┘  └─────────────────────┘  │
│         5mm espaço              5mm espaço         │
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │  Verso (70×110)     │  │  Verso (70×110)     │  │
│  │  (alinhado com      │  │  (alinhado com      │  │
│  │   Carta 03)         │  │   Carta 04)         │  │
│  └─────────────────────┘  └─────────────────────┘  │
│                                            Margem   │
└─────────────────────────────────────────────────────┘
```

### 8. Características do Algoritmo

✅ **Tamanho Exato**
- Cada carta mantém suas dimensões originais (70 × 110 mm)
- Nenhuma imagem é redimensionada ou cortada

✅ **Organização Automática**
- Calcula automaticamente quantas cartas cabem por linha
- Quebra linhas quando necessário
- Cria novas páginas quando necessário

✅ **Verso Perfeito**
- Espelhamento automático de margens
- Alinhamento pixel-perfeito para impressão frente e verso
- Mesma imagem replicada em todas as páginas de verso

✅ **Pronto para Gráfica**
- Guias de corte visuais
- Marcas de alinhamento
- Instruções claras de impressão

### 9. Resultado Esperado

| Métrica | Valor |
|---------|-------|
| **Total de Cartas** | 36 |
| **Páginas de Frente** | 9 |
| **Páginas de Verso** | 9 |
| **Total de Páginas** | 18 |
| **Cartas por Página** | 4 |
| **Tamanho Final de Cada Carta** | 70 × 110 mm |
| **Tempo de Impressão** | ~5 minutos |
| **Tempo de Corte** | ~15 minutos |

### 10. Casos de Uso Similares

Este exemplo funciona para qualquer quantidade de cartas:

| Cartas | Páginas | Cartas/Página |
|--------|---------|---------------|
| 12 | 3 | 4 |
| 24 | 6 | 4 |
| 36 | 9 | 4 |
| 52 | 13 | 4 |
| 78 | 19-20 | 4 |
| 100 | 25 | 4 |

**Nota:** O número de páginas pode variar se as dimensões das cartas forem diferentes.

## Conclusão

Com o **Card Layout & Print Manager**, você consegue:

1. ✅ Upload de 36 cartas em segundos
2. ✅ Organização automática em 9 páginas
3. ✅ Verso alinhado perfeitamente
4. ✅ PDF pronto para impressão e corte
5. ✅ Sem redimensionamento ou corte de imagens
6. ✅ Resultado profissional

**Tempo total: 5 minutos do upload ao PDF pronto!**

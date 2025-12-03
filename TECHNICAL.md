# Documentação Técnica - Card Layout & Print Manager

## Arquitetura do Projeto

O projeto é um web app Vue 3 + Vite com as seguintes camadas:

### Frontend (Vue 3)
- **App.vue**: Componente principal que gerencia o estado da aplicação
- **Componentes reutilizáveis**: ImageUploadArea, PagePreview, SettingsPanel
- **Estilos**: Tailwind CSS 4 para design responsivo

### Lógica de Negócio (JavaScript)
- **layoutEngine.js**: Algoritmo de empacotamento de retângulos para organizar cartas
- **pdfGenerator.js**: Geração de PDF com jsPDF
- **backPageGenerator.js**: Lógica de espelhamento de margens para verso

### Testes (Vitest)
- **layoutEngine.test.js**: 13 testes para validar cálculo de layout
- **backPageGenerator.test.js**: 14 testes para validar verso
- **integration.test.js**: 12 testes de integração para fluxo completo

## Fluxo de Dados

```
Upload de Imagens
       ↓
Validação de Imagens (validateImages)
       ↓
Cálculo de Layout (calculateLayout)
       ↓
Pré-visualização em Tempo Real
       ↓
Geração de Verso (generateBackPages)
       ↓
Geração de PDF (generatePDFFromPages)
       ↓
Download do Arquivo PDF
```

## Algoritmo de Layout

### Estratégia de Empacotamento

O app utiliza uma estratégia de **First Fit Decreasing Height** (FFD) modificada:

1. **Cálculo de Dimensões**: Cada imagem é redimensionada mantendo a proporção de aspecto
2. **Organização por Linhas**: Cartas são organizadas da esquerda para direita
3. **Quebra de Linha**: Quando uma carta não cabe na linha atual, passa para a próxima
4. **Quebra de Página**: Quando não cabe na página, uma nova página é criada

### Pseudocódigo do Algoritmo

```javascript
for cada imagem:
  calcular dimensões mantendo proporção
  
  if não cabe na linha atual:
    ir para próxima linha
  
  if não cabe na página:
    ir para próxima página
  
  adicionar carta à página
```

### Complexidade

- **Tempo**: O(n) onde n é o número de imagens
- **Espaço**: O(p) onde p é o número de páginas

## Funcionalidade de Verso

### Espelhamento de Margens

O verso é gerado com margens espelhadas para garantir alinhamento perfeito:

```
Frente:                Verso (espelhado):
┌─────────────┐       ┌─────────────┐
│ Margem      │       │      Margem │
│ ┌─────────┐ │       │ ┌─────────┐ │
│ │ Carta   │ │       │ │ Verso   │ │
│ └─────────┘ │       │ └─────────┘ │
│             │       │             │
└─────────────┘       └─────────────┘
```

### Cálculo de Posição

```javascript
// Frente
cardX = margin + currentRowWidth

// Verso (espelhado)
backCardX = pageWidth - margin - cardWidth
```

## Geração de PDF

### Bibliotecas Utilizadas

- **jsPDF**: Geração de PDF com suporte a imagens
- **html2canvas**: Conversão de elementos HTML para canvas (se necessário)

### Processo de Geração

1. Criar instância de jsPDF com dimensões da página
2. Para cada página de frente:
   - Adicionar página ao PDF
   - Para cada carta:
     - Converter imagem para base64
     - Adicionar imagem ao PDF com posicionamento correto
3. Se verso habilitado:
   - Gerar páginas de verso
   - Repetir processo para verso

### Dimensões e Conversão

```javascript
// Conversão de unidades
1 mm = 3.78 pixels (96 DPI)

// Exemplo
cardWidth = 50 mm
cardWidthPx = 50 * 3.78 = 189 pixels
```

## Estrutura de Dados

### Objeto de Imagem

```javascript
{
  src: "data:image/jpeg;base64,...",  // Data URL
  width: 400,                          // Largura original em pixels
  height: 600,                         // Altura original em pixels
}
```

### Objeto de Carta Posicionada

```javascript
{
  src: "data:image/jpeg;base64,...",  // Data URL
  x: 10,                               // Posição X em mm
  y: 10,                               // Posição Y em mm
  displayWidth: 50,                    // Largura exibida em mm
  displayHeight: 75,                   // Altura exibida em mm
  originalWidth: 400,                  // Largura original em pixels
  originalHeight: 600,                 // Altura original em pixels
  isBackPage: false                    // Flag para verso
}
```

### Objeto de Página

```javascript
[
  { src: "...", x: 10, y: 10, displayWidth: 50, displayHeight: 75 },
  { src: "...", x: 65, y: 10, displayWidth: 50, displayHeight: 75 },
  // ... mais cartas
]
```

### Objeto de Configurações

```javascript
{
  pageSize: "A4",      // "A4", "A3", ou "custom"
  customWidth: 210,    // Largura em mm (se custom)
  customHeight: 297,   // Altura em mm (se custom)
  margin: 10,          // Margem em mm
  spacing: 5,          // Espaço entre cartas em mm
  includeBack: false   // Incluir verso
}
```

## Validação

### Validação de Imagens

```javascript
validateImages(images) → {
  isValid: boolean,
  errors: string[]
}
```

Verifica:
- Imagens não vazias
- Dimensões válidas (> 0)
- Imagens carregadas corretamente

### Validação de Alinhamento de Verso

```javascript
validateBackPageAlignment(frontPages, backPages) → {
  isAligned: boolean,
  errors: string[]
}
```

Verifica:
- Número igual de páginas
- Dimensões compatíveis
- Páginas não vazias

## Performance

### Otimizações

1. **Lazy Loading**: Imagens são carregadas sob demanda
2. **Cálculo Eficiente**: Layout é recalculado apenas quando necessário
3. **Renderização Otimizada**: Vue 3 utiliza Virtual DOM
4. **Compressão de PDF**: jsPDF comprime imagens automaticamente

### Limites Recomendados

- **Máximo de imagens**: 100 (por performance)
- **Tamanho máximo de imagem**: 5 MB
- **Resolução máxima**: 4000 x 6000 pixels

## Testes

### Cobertura de Testes

| Módulo | Testes | Cobertura |
|--------|--------|-----------|
| layoutEngine.js | 13 | 100% |
| backPageGenerator.js | 14 | 100% |
| integration | 12 | Fluxo completo |
| **Total** | **39** | **100%** |

### Executar Testes

```bash
# Modo watch
npm test

# Modo run (uma vez)
npm test -- --run

# Com cobertura
npm test -- --coverage
```

## Dependências

### Produção

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| vue | ^3.3.0 | Framework JavaScript |
| jspdf | ^2.5.1 | Geração de PDF |
| html2canvas | ^1.4.1 | Conversão HTML para canvas |

### Desenvolvimento

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| vite | ^5.0.0 | Build tool |
| @vitejs/plugin-vue | ^5.0.0 | Plugin Vue para Vite |
| vitest | ^1.0.0 | Framework de testes |
| tailwindcss | ^4.0.0 | CSS framework |
| jsdom | ^23.0.0 | DOM para testes |

## Build e Deploy

### Desenvolvimento

```bash
npm install
npm run dev
# Acesso em http://localhost:5173
```

### Produção

```bash
npm run build
# Saída em ./dist
```

### Estrutura de Saída

```
dist/
├── index.html
├── assets/
│   ├── index-HASH.js
│   └── index-HASH.css
└── ...
```

## Segurança

### Considerações

1. **Processamento Local**: Todas as imagens são processadas no navegador
2. **Sem Servidor**: Não há envio de dados para servidor
3. **HTTPS Recomendado**: Para produção, usar HTTPS
4. **Validação de Entrada**: Todas as entradas são validadas

## Melhorias Futuras

1. **Drag-and-Drop**: Reordenação de cartas
2. **Undo/Redo**: Histórico de ações
3. **Presets**: Modelos pré-configurados
4. **Exportação**: Suporte a outros formatos (PNG, SVG)
5. **Colaboração**: Compartilhamento de layouts
6. **Banco de Dados**: Salvar layouts na nuvem

## Troubleshooting

### Problema: PDF não é gerado

**Solução**: Verificar console do navegador para erros de JavaScript

### Problema: Imagens não aparecem na pré-visualização

**Solução**: Verificar se as imagens foram carregadas corretamente (verificar aba Network)

### Problema: Layout incorreto

**Solução**: Ajustar margens e espaçamento, verificar dimensões das imagens

## Referências

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)

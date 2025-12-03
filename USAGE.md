# Guia de Uso - Card Layout & Print Manager

## Visão Geral

O **Card Layout & Print Manager** é um web app que permite organizar imagens de cartas em páginas para impressão profissional. Com suporte a múltiplos tamanhos de página, ajuste de margens e espaçamento, além de funcionalidade de verso com espelhamento de margens para alinhamento perfeito.

## Funcionalidades Principais

### 1. Upload de Imagens

**Como fazer upload:**

1. Clique na área de upload ou arraste imagens diretamente para a área de "Drop Zone"
2. Selecione múltiplas imagens de uma vez (JPG, PNG, GIF, WebP)
3. As imagens serão carregadas e organizadas automaticamente

**Dicas:**
- Quanto maior a resolução da imagem, melhor a qualidade final do PDF
- Imagens com proporções diferentes serão redimensionadas mantendo a proporção

### 2. Configurações de Página

**Tamanho da Página:**
- **A4**: 210 x 297 mm (padrão)
- **A3**: 297 x 420 mm (maior)
- **Personalizado**: Defina suas próprias dimensões

**Margem:**
- Define o espaço vazio ao redor das cartas na página
- Padrão: 10 mm
- Recomendado: 5-15 mm para impressão segura

**Espaço entre Cartas:**
- Define o espaço horizontal e vertical entre as cartas
- Padrão: 5 mm
- Aumentar este valor deixa as cartas mais espaçadas

### 3. Pré-visualização em Tempo Real

- Veja como as cartas ficarão organizadas antes de gerar o PDF
- A visualização é atualizada automaticamente quando você muda as configurações
- Cada página é mostrada separadamente com número de página

### 4. Verso com Espelhamento

**Como usar:**

1. Marque a opção "Incluir Verso"
2. Selecione uma imagem para o verso
3. A imagem será replicada em todas as páginas de verso
4. As margens serão automaticamente espelhadas para alinhamento perfeito

**Espelhamento de Margens:**
- A margem esquerda da frente vira margem direita do verso
- Garante corte perfeito quando você imprime frente e verso
- Ideal para cartas que serão cortadas e montadas

### 5. Geração de PDF

**Para gerar o PDF:**

1. Configure todas as opções desejadas
2. Clique no botão "Gerar PDF"
3. O arquivo será baixado automaticamente como `card-layout.pdf`

**Dicas de Impressão:**

- Use papel de qualidade (mínimo 250 gsm para cartas)
- Imprima em escala 100% (sem redimensionamento)
- Para verso, imprima as páginas de verso separadamente
- Alinhe as páginas de verso com as de frente antes de cortar

### 6. Exportar Configurações

- Clique em "Exportar Config" para salvar suas configurações em JSON
- Útil para reutilizar as mesmas configurações depois
- O arquivo contém informações sobre tamanho de página, margens e espaçamento

## Exemplos de Uso

### Exemplo 1: Cartas de Visita Padrão

1. Selecione **A4** como tamanho de página
2. Configure **margem de 10 mm**
3. Configure **espaço de 3 mm** entre cartas
4. Envie suas imagens de cartas de visita
5. Clique em "Gerar PDF"

### Exemplo 2: Cartas com Verso

1. Selecione **A4** como tamanho de página
2. Marque "Incluir Verso"
3. Envie as imagens da frente
4. Selecione uma imagem para o verso
5. Clique em "Gerar PDF"
6. Imprima as páginas de frente normalmente
7. Insira o papel novamente e imprima as páginas de verso

### Exemplo 3: Tamanho Personalizado

1. Selecione "Personalizado" como tamanho de página
2. Configure largura e altura desejadas (em mm)
3. Ajuste margens e espaçamento
4. Envie suas imagens
5. Clique em "Gerar PDF"

## Dicas e Boas Práticas

### Qualidade de Impressão

- **Resolução mínima**: 300 DPI para impressão de qualidade
- **Formato de arquivo**: Use PNG ou JPG de alta qualidade
- **Tamanho de arquivo**: Imagens maiores = melhor qualidade

### Organização de Cartas

- As cartas são organizadas automaticamente da esquerda para direita, de cima para baixo
- Se uma carta não cabe na linha atual, ela passa para a próxima linha
- Se não cabe na página, uma nova página é criada

### Ajuste de Margens

- Margens muito pequenas (< 5 mm) podem resultar em corte impreciso
- Margens muito grandes (> 20 mm) desperdiçam espaço
- Use 10 mm como padrão para melhor resultado

### Corte de Cartas

- Deixe pelo menos 2-3 mm de margem extra para corte seguro
- Use uma tesoura ou cortador de papel para melhor precisão
- Para cortes retos, use uma régua e um cortador de papel profissional

## Resolução de Problemas

### As imagens não aparecem na pré-visualização

- Verifique se as imagens foram carregadas corretamente
- Tente recarregar a página
- Certifique-se de que as imagens têm dimensões válidas

### O PDF não está sendo gerado

- Verifique se pelo menos uma imagem foi carregada
- Se "Incluir Verso" está marcado, certifique-se de que uma imagem de verso foi selecionada
- Tente usar um navegador diferente

### As cartas estão muito próximas ou muito distantes

- Ajuste o valor de "Espaço entre Cartas"
- Aumentar o valor deixa as cartas mais distantes
- Diminuir o valor deixa as cartas mais próximas

### O verso não está alinhado com a frente

- Certifique-se de que as margens estão corretas
- Use o mesmo tamanho de página para frente e verso
- Imprima em escala 100% sem redimensionamento

## Especificações Técnicas

| Aspecto | Detalhes |
|---------|----------|
| Formatos de Imagem | JPG, PNG, GIF, WebP |
| Tamanhos de Página | A4, A3, Personalizado |
| Unidade de Medida | Milímetros (mm) |
| Formato de Saída | PDF (jsPDF) |
| Navegadores Suportados | Chrome, Firefox, Safari, Edge |

## Licença

MIT - Sinta-se livre para usar e modificar este app conforme necessário.

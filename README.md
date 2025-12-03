# Card Layout & Print Manager

Um web app para organizar imagens de cartas em páginas para impressão com layout dinâmico, ajuste de margens e espaçamento, e geração de PDF otimizado.

## Funcionalidades

- **Upload de Múltiplas Imagens**: Envie várias imagens de cartas de uma vez
- **Tamanhos de Página Predefinidos**: A4, A3 ou personalizado
- **Ajuste de Margens**: Configure as margens da página
- **Espaçamento Entre Cartas**: Ajuste o espaço entre as cartas
- **Verso com Espelhamento**: Adicione um verso com espelhamento de margens para alinhamento perfeito
- **Pré-visualização em Tempo Real**: Veja como as cartas ficarão organizadas
- **Geração de PDF**: Exporte o layout em PDF para impressão

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

## Build

```bash
npm run build
```

## Estrutura do Projeto

```
card_layout_app/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes Vue
│   ├── utils/          # Funções utilitárias
│   ├── styles/         # Arquivos CSS
│   ├── App.vue         # Componente principal
│   └── main.js         # Ponto de entrada
├── index.html          # HTML principal
├── vite.config.js      # Configuração Vite
├── tailwind.config.js  # Configuração Tailwind
└── package.json        # Dependências
```

## Tecnologias

- **Vue 3**: Framework JavaScript
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **jsPDF**: Geração de PDF
- **Canvas**: Manipulação de imagens

## Uso

1. Configure o tamanho da página (A4, A3 ou personalizado)
2. Ajuste as margens e espaçamento conforme necessário
3. Ative a opção de verso se desejado
4. Envie as imagens das cartas
5. Visualize o layout em tempo real
6. Gere o PDF para impressão

## Licença

MIT

# 📦 Instalação e Configuração Local

## Pré-requisitos

- **Node.js** 16.0 ou superior
- **npm** 7.0 ou superior
- **Git** (opcional, para clonar o repositório)

## Instalação Rápida

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/card_layout_app.git
cd card_layout_app
```

Ou baixar o ZIP:
1. Acesse https://github.com/seu-usuario/card_layout_app
2. Clique em "Code" → "Download ZIP"
3. Extraia o arquivo
4. Abra o terminal na pasta

### 2. Instalar Dependências

```bash
npm install
```

### 3. Rodar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

### 4. Fazer Build para Produção

```bash
npm run build
```

Os arquivos prontos para produção estarão em: `dist/`

---

## Estrutura do Projeto

```
card_layout_app/
├── src/
│   ├── components/              # Componentes Vue
│   │   ├── ImageUploadArea.vue
│   │   ├── PagePreview.vue
│   │   └── SettingsPanel.vue
│   ├── utils/                   # Lógica da aplicação
│   │   ├── layoutEngine.js      # Algoritmo de layout
│   │   ├── pdfGenerator.js      # Geração de PDF
│   │   ├── backPageGenerator.js # Verso com espelhamento
│   │   ├── cutGuides.js         # Guias de corte
│   │   └── __tests__/           # Testes unitários
│   ├── styles/
│   │   └── main.css
│   ├── App.vue                  # Componente principal
│   └── main.js                  # Ponto de entrada
├── public/                      # Arquivos estáticos
├── dist/                        # Build de produção
├── index.html                   # HTML principal
├── package.json                 # Dependências
├── vite.config.js              # Configuração Vite
├── tailwind.config.js          # Configuração Tailwind
├── vitest.config.js            # Configuração Vitest
├── vercel.json                 # Configuração Vercel
├── netlify.toml                # Configuração Netlify
└── README.md                   # Documentação
```

---

## Scripts Disponíveis

### Desenvolvimento

```bash
# Rodar servidor de desenvolvimento
npm run dev

# Rodar com porta específica
npm run dev -- --port 3000
```

### Build

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

### Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo observação
npm test -- --watch

# Rodar testes com coverage
npm test -- --coverage
```

### Linting (opcional)

```bash
# Se quiser adicionar linting
npm install --save-dev eslint
npx eslint src/
```

---

## Dependências Principais

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| **vue** | ^3.0 | Framework frontend |
| **vite** | ^5.0 | Build tool |
| **tailwindcss** | ^4.0 | Styling |
| **jspdf** | ^2.5 | Geração de PDF |
| **vitest** | ^1.0 | Testes unitários |

---

## Troubleshooting

### Erro: "npm: command not found"

**Solução:** Instale Node.js de https://nodejs.org

### Erro: "Port 5173 is already in use"

**Solução:**
```bash
# Opção 1: Usar outra porta
npm run dev -- --port 3000

# Opção 2: Matar processo na porta 5173
# Linux/Mac:
lsof -i :5173
kill -9 <PID>

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Erro: "Module not found"

**Solução:**
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Cannot find module 'jspdf'"

**Solução:**
```bash
npm install jspdf
npm run build
```

### Pré-visualização não carrega

**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros
3. Tente recarregar a página (Ctrl+F5)
4. Limpe o cache do navegador

---

## Desenvolvimento

### Adicionar Nova Funcionalidade

1. Criar arquivo em `src/utils/novaFuncao.js`
2. Criar testes em `src/utils/__tests__/novaFuncao.test.js`
3. Importar em `src/App.vue`
4. Testar: `npm test`
5. Build: `npm run build`

### Modificar Interface

1. Editar componente em `src/components/`
2. Testar localmente: `npm run dev`
3. Verificar responsividade
4. Build: `npm run build`

### Adicionar Dependência

```bash
# Instalar pacote
npm install nome-do-pacote

# Instalar como dev dependency
npm install --save-dev nome-do-pacote

# Atualizar package.json
git add package.json package-lock.json
git commit -m "Add dependency: nome-do-pacote"
```

---

## Performance

### Otimizações Implementadas

- ✅ Code splitting automático
- ✅ Tree shaking
- ✅ Minificação de CSS e JS
- ✅ Compressão de imagens
- ✅ Lazy loading de componentes

### Tamanho do Build

```
dist/
├── index.html                 0.40 kB
├── assets/index.css          1.85 kB (gzip: 0.90 kB)
├── assets/index.js         641.80 kB (gzip: 197.59 kB)
└── assets/vendor.js        150.69 kB (gzip: 51.52 kB)
```

---

## Segurança

### Boas Práticas Implementadas

- ✅ Validação de entrada
- ✅ Sanitização de dados
- ✅ Sem armazenamento de dados sensíveis
- ✅ HTTPS recomendado para produção
- ✅ CSP headers configurados

---

## Suporte

Para mais informações:
- **Documentação Vite:** https://vitejs.dev
- **Documentação Vue 3:** https://vuejs.org
- **Documentação Tailwind:** https://tailwindcss.com
- **Documentação jsPDF:** https://github.com/parallax/jsPDF

---

**Pronto para começar! 🚀**

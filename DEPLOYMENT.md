# Guia de Deployment - Card Layout & Print Manager

Este documento descreve como implantar a aplicação permanentemente em diferentes plataformas.

## 🚀 Opção 1: Vercel (Recomendado)

Vercel é a plataforma oficial para aplicações Vite. Deployment é automático e gratuito.

### Passo 1: Preparar o Repositório GitHub

```bash
# Criar repositório no GitHub
# https://github.com/new

# Clonar o repositório localmente
git clone https://github.com/seu-usuario/card_layout_app.git
cd card_layout_app

# Adicionar os arquivos
git add .
git commit -m "Initial commit: Card Layout & Print Manager v1.0.0"
git push -u origin main
```

### Passo 2: Conectar ao Vercel

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Selecione seu repositório `card_layout_app`
5. Clique em "Import"
6. Vercel detectará automaticamente que é um projeto Vite
7. Clique em "Deploy"

### Passo 3: Configuração Automática

Vercel usará automaticamente:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

**Seu site estará disponível em:** `https://card-layout-app.vercel.app`

### Passo 4: Domínio Personalizado (Opcional)

1. Na dashboard do Vercel, vá para "Settings" → "Domains"
2. Clique em "Add Domain"
3. Insira seu domínio (ex: `cardlayout.com`)
4. Siga as instruções para configurar o DNS

---

## 🚀 Opção 2: Netlify

Netlify também oferece deployment gratuito com integração contínua.

### Passo 1: Preparar o Repositório GitHub

(Mesmo processo da Opção 1)

### Passo 2: Conectar ao Netlify

1. Acesse https://netlify.com
2. Clique em "New site from Git"
3. Selecione "GitHub"
4. Autorize o Netlify a acessar seus repositórios
5. Selecione `card_layout_app`
6. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Clique em "Deploy site"

### Passo 3: Seu Site Estará Disponível

**URL padrão:** `https://card-layout-app.netlify.app`

### Passo 4: Domínio Personalizado (Opcional)

1. Na dashboard do Netlify, vá para "Site settings" → "Domain management"
2. Clique em "Add domain"
3. Insira seu domínio personalizado
4. Configure o DNS conforme instruído

---

## 🚀 Opção 3: GitHub Pages

Deployment gratuito usando GitHub Pages.

### Passo 1: Configurar o Vite

Edite `vite.config.js`:

```javascript
export default {
  base: '/card_layout_app/',
  // ... resto da configuração
}
```

### Passo 2: Fazer Build

```bash
npm run build
```

### Passo 3: Deploy com GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar script ao package.json
# "deploy": "gh-pages -d dist"

# Fazer deploy
npm run deploy
```

**Seu site estará disponível em:** `https://seu-usuario.github.io/card_layout_app`

---

## 🚀 Opção 4: Servidor Próprio

Se você tem um servidor próprio ou VPS.

### Passo 1: Fazer Build

```bash
npm run build
```

### Passo 2: Copiar Arquivos

```bash
# Copiar pasta dist para seu servidor
scp -r dist/ usuario@seu-servidor.com:/var/www/card-layout-app/
```

### Passo 3: Configurar Nginx

```nginx
server {
    listen 80;
    server_name cardlayout.com www.cardlayout.com;

    root /var/www/card-layout-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Passo 4: Reiniciar Nginx

```bash
sudo systemctl restart nginx
```

---

## 📊 Comparação de Plataformas

| Plataforma | Custo | Setup | Domínio | CI/CD | Recomendação |
|-----------|-------|-------|--------|-------|--------------|
| **Vercel** | Gratuito | Fácil | Sim | Automático | ⭐⭐⭐⭐⭐ |
| **Netlify** | Gratuito | Fácil | Sim | Automático | ⭐⭐⭐⭐ |
| **GitHub Pages** | Gratuito | Médio | Sim | Manual | ⭐⭐⭐ |
| **Servidor Próprio** | Variável | Difícil | Sim | Manual | ⭐⭐ |

---

## ✅ Verificação Pós-Deployment

Após fazer o deployment, verifique:

1. **Página carrega corretamente**
   - Abra a URL no navegador
   - Verifique se o header e sidebar aparecem

2. **Upload de imagens funciona**
   - Tente fazer upload de uma imagem
   - Verifique se a pré-visualização carrega

3. **Geração de PDF funciona**
   - Gere um PDF de teste
   - Verifique se o arquivo foi baixado

4. **Verso funciona**
   - Marque "Incluir Verso"
   - Selecione uma imagem de verso
   - Gere o PDF e verifique se tem páginas de verso

5. **Responsividade**
   - Teste em mobile, tablet e desktop
   - Verifique se a interface se adapta

---

## 🔄 Atualizações Futuras

### Com Vercel/Netlify

Atualizações são automáticas:

```bash
# Fazer mudanças localmente
git add .
git commit -m "Descrição da mudança"
git push origin main

# Vercel/Netlify detectam automaticamente e fazem deploy
```

### Com Servidor Próprio

```bash
# Fazer mudanças localmente
npm run build

# Copiar novo build
scp -r dist/ usuario@seu-servidor.com:/var/www/card-layout-app/
```

---

## 🆘 Troubleshooting

### Erro: "Module not found"

Solução:
```bash
npm install
npm run build
```

### Erro: "Port already in use"

Solução:
```bash
# Matar processo na porta 5173
lsof -i :5173
kill -9 <PID>

# Ou usar outra porta
npm run dev -- --port 3000
```

### Erro: "PDF não gera"

Verifique:
1. Se jsPDF está instalado: `npm list jspdf`
2. Se há erros no console do navegador (F12)
3. Se as imagens estão sendo carregadas corretamente

### Erro: "Pré-visualização não carrega"

Verifique:
1. Se as imagens estão sendo enviadas corretamente
2. Se há erros no console (F12)
3. Se o navegador suporta FileReader API

---

## 📞 Suporte

Para mais informações:
- Documentação Vite: https://vitejs.dev
- Documentação Vercel: https://vercel.com/docs
- Documentação Netlify: https://docs.netlify.com

---

**Recomendação:** Use **Vercel** para o melhor balance entre facilidade, performance e recursos. ⭐

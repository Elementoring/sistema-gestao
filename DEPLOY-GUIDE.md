# 🚀 GUIA DE DEPLOY - Render.com

## 🌟 Por que Render.com?

**Render.com** é a melhor opção 100% gratuita para deploy completo porque:

✅ **Tudo em um lugar:**
- PostgreSQL Database (gratuito)
- Backend Node.js (gratuito)
- Frontend React (gratuito)

✅ **Vantagens:**
- Deploy automático via GitHub
- SSL/HTTPS gratuito e automático
- Zero configuração de infraestrutura
- URLs amigáveis (`.onrender.com`)
- Logs em tempo real
- Fácil de escalar no futuro

⚠️ **Limitações do tier gratuito:**
- Apps dormem após 15 min de inatividade (acordam em ~1 min ao acessar)
- 750 horas/mês de database PostgreSQL
- Banda limitada

---

## 📋 PRÉ-REQUISITOS

1. ✅ Código no GitHub (já temos!)
2. ✅ Conta no Render.com (criar em https://render.com)
3. ✅ Conectar GitHub ao Render

---

## 🚀 DEPLOY AUTOMÁTICO (Opção 1 - RECOMENDADO)

### Passo 1: Criar conta no Render.com

1. Acesse: https://render.com/
2. Clique em **"Get Started"**
3. Faça login com GitHub
4. Autorize o acesso ao repositório `Elementoring/sistema-gestao`

### Passo 2: Deploy via Blueprint (render.yaml)

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Blueprint"**
3. Conecte seu repositório: `Elementoring/sistema-gestao`
4. O Render detectará automaticamente o `render.yaml`
5. Clique em **"Apply"**

**O Render criará automaticamente:**
- ✅ PostgreSQL database
- ✅ Backend service
- ✅ Frontend service

### Passo 3: Configurar variáveis secretas

Após o deploy inicial, configure:

1. Vá em **Services** > **cred-management-backend**
2. Clique em **Environment**
3. Adicione/edite:
   - `ADMIN_PASSWORD`: sua_senha_forte_aqui
   - `JWT_SECRET`: (já gerado automaticamente)

### Passo 4: Executar setup do banco

1. Vá em **Services** > **cred-management-backend**
2. Clique em **Shell**
3. Execute:
   ```bash
   npm run db:setup
   ```

### Passo 5: Acessar o sistema

Suas URLs serão:
- **Frontend:** `https://cred-management-frontend.onrender.com`
- **Backend API:** `https://cred-management-backend.onrender.com`
- **Banco:** Conectado internamente

---

## 🔧 DEPLOY MANUAL (Opção 2 - Se Opção 1 falhar)

### Passo 1: Criar PostgreSQL Database

1. Dashboard > **"New +"** > **"PostgreSQL"**
2. Configure:
   - Name: `cred-management-db`
   - Database: `cred_management`
   - User: `cred_admin`
   - Region: `Oregon` (mais rápido para Brasil)
   - Plan: **Free**
3. Clique em **"Create Database"**
4. **Copie a "Internal Database URL"** (usaremos depois)

### Passo 2: Deploy do Backend

1. Dashboard > **"New +"** > **"Web Service"**
2. Conecte o repositório: `Elementoring/sistema-gestao`
3. Configure:
   - Name: `cred-management-backend`
   - Region: `Oregon`
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: **Node**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**
4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=[Cole a Internal Database URL aqui]
   JWT_SECRET=[Gere com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"]
   ADMIN_PASSWORD=admin123
   ADMIN_USERNAME=admin
   ADMIN_FULL_NAME=Administrador
   ```
5. Clique em **"Create Web Service"**
6. Aguarde o build e deploy
7. **Copie a URL do backend** (ex: `https://cred-management-backend.onrender.com`)

### Passo 3: Setup do Banco de Dados

1. Vá em **Services** > **cred-management-backend**
2. Clique em **"Shell"** (terminal)
3. Execute:
   ```bash
   npm run db:setup
   ```
4. Confirme que viu: "✅ Banco de dados configurado com sucesso!"

### Passo 4: Deploy do Frontend

1. Dashboard > **"New +"** > **"Static Site"**
2. Conecte o repositório: `Elementoring/sistema-gestao`
3. Configure:
   - Name: `cred-management-frontend`
   - Region: `Oregon`
   - Branch: `main`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Plan: **Free**
4. **Environment Variables:**
   ```
   VITE_API_URL=[Cole a URL do backend aqui]
   ```
   Exemplo: `VITE_API_URL=https://cred-management-backend.onrender.com`
5. Clique em **"Create Static Site"**

### Passo 5: Configurar CORS no Backend

1. Acesse o backend no Render
2. Vá em **Environment**
3. Adicione:
   ```
   ALLOWED_ORIGINS=https://cred-management-frontend.onrender.com
   ```
4. Salve e aguarde o redeploy automático

---

## 🎉 SISTEMA NO AR!

Acesse: `https://cred-management-frontend.onrender.com`

**Login:**
- Usuário: `admin`
- Senha: `admin123` (ou a que você configurou em ADMIN_PASSWORD)

⚠️ **IMPORTANTE:** Altere a senha no primeiro acesso!

---

## 🔄 DEPLOYS FUTUROS

Agora é **automático**! Sempre que você fizer `git push` para o GitHub:
1. Render detecta as mudanças
2. Rebuilda automaticamente
3. Faz deploy da nova versão

---

## 📊 MONITORAMENTO

No dashboard do Render você pode ver:
- ✅ Logs em tempo real
- ✅ Status dos serviços
- ✅ Métricas de uso
- ✅ Histórico de deploys
- ✅ Shell/terminal interativo

---

## 🆘 TROUBLESHOOTING

### Erro: "Application failed to respond"
- Verifique se PORT=3001 no backend
- Verifique os logs do serviço

### Erro: "Database connection failed"
- Verifique se DATABASE_URL está correta
- Use a **Internal Database URL**, não a External

### Frontend não conecta ao backend
- Verifique VITE_API_URL no frontend
- Verifique ALLOWED_ORIGINS no backend
- Rebuild o frontend após mudar variáveis

### App dormindo (sleeping)
- É normal no tier free após 15min de inatividade
- Primeiro acesso leva ~1 minuto para acordar
- Para evitar: upgrade para plano pago ($7/mês)

---

## 💰 CUSTOS

**100% GRATUITO** com limitações:
- PostgreSQL: 750h/mês (suficiente para 1 app)
- Web Services: Dormem após inatividade
- 100GB de bandwidth/mês

Se precisar de mais:
- **Hobby Plan**: $7/mês por serviço
- Sem sleep, mais recursos

---

## 🔐 SEGURANÇA EM PRODUÇÃO

✅ **Já configurado:**
- HTTPS/SSL automático
- Variáveis de ambiente seguras
- Banco isolado

⚠️ **Você deve:**
1. Alterar ADMIN_PASSWORD para senha forte
2. Gerar JWT_SECRET aleatório
3. Alterar senha do admin no primeiro login
4. Configurar backup do banco (manual no free tier)

---

## 📚 RECURSOS

- **Dashboard:** https://dashboard.render.com
- **Docs:** https://render.com/docs
- **Status:** https://status.render.com
- **Suporte:** https://render.com/support

---

**🎊 Seu sistema está pronto para produção!**

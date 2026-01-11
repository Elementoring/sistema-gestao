# 🚀 Guia de Inicialização - Cred Management +

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Instalar PostgreSQL

**Windows:**
1. Baixe: https://www.postgresql.org/download/windows/
2. Instale com senha: `postgres` (ou anote a que escolher)
3. Porta padrão: 5432

### 2️⃣ Instalar Dependências do Projeto

Abra o PowerShell na pasta do projeto:

```powershell
# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend  
cd ../frontend
npm install

# Voltar para raiz
cd ..
```

### 3️⃣ Configurar Banco de Dados

**Opção A: Via psql (Terminal PostgreSQL)**

```powershell
# Abrir psql
psql -U postgres

# No terminal do psql, digite:
CREATE DATABASE cred_management;
\q
```

**Opção B: Via pgAdmin** (Interface Gráfica)
1. Abra o pgAdmin
2. Conecte ao servidor local
3. Clique direito em "Databases" → "Create" → "Database"
4. Nome: `cred_management`
5. Salvar

### 4️⃣ Configurar Variáveis de Ambiente

Copie e renomeie o arquivo de exemplo:

```powershell
cd backend
Copy-Item .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/cred_management
JWT_SECRET=cred_management_super_secret_key_change_in_production_123456789
NODE_ENV=development
```

**⚠️ IMPORTANTE:** Altere `SUA_SENHA_AQUI` para a senha que você definiu no PostgreSQL!

### 5️⃣ Criar Tabelas e Usuário Admin

```powershell
# Ainda na pasta backend
npm run db:setup
```

Você verá:
```
✅ Banco de dados configurado com sucesso!
👤 Usuário admin criado - Login: admin / Senha: admin123

⚠️ **ALTERE A SENHA NO PRIMEIRO ACESSO!**
```

### 6️⃣ Iniciar o Sistema

**Opção A: Iniciar tudo de uma vez (Recomendado)**

Na pasta raiz do projeto:

```powershell
npm run dev
```

**Opção B: Iniciar separadamente**

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 7️⃣ Acessar o Sistema

Abra o navegador em: **http://localhost:5173**

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin123`

⚠️ **ALTERE IMEDIATAMENTE NO PRIMEIRO LOGIN!**

---

## 🌐 Configurar para Rede Local

Para permitir acesso de outros computadores:

### 1. Descobrir seu IP local

```powershell
ipconfig
```

Procure por "Endereço IPv4" (ex: 192.168.1.100)

### 2. Configurar o frontend

Edite `frontend/src/config.ts`:

```typescript
export const API_URL = 'http://192.168.1.100:3001'; // Use seu IP
```

### 3. Iniciar frontend em modo rede

```powershell
cd frontend
npm run dev -- --host
```

### 4. Nos outros computadores

Acesse: `http://192.168.1.100:5173`

---

## 👥 Criar Novos Usuários

### Método 1: Via Interface (Após login como admin)

1. Faça login como `admin`
2. Vá em "Usuários" no menu
3. Clique em "Novo Usuário"
4. Preencha os dados e salve

### Método 2: Via SQL (psql)

```sql
-- Conectar ao banco
psql -U postgres -d cred_management

-- Criar usuário (você precisa gerar o hash da senha primeiro)
INSERT INTO users (username, password, full_name, role) 
VALUES ('joao', '$2a$10$...HASH_DA_SENHA...', 'João Silva', 'user');
```

Para gerar hash de senha:

```powershell
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('suasenha', 10));"
```

---

## 🔧 Comandos Úteis

### Backend

```powershell
cd backend
npm run dev        # Iniciar em modo desenvolvimento
npm run build      # Compilar TypeScript
npm run start      # Iniciar versão compilada
npm run db:setup   # Recriar banco de dados
```

### Frontend

```powershell
cd frontend
npm run dev        # Iniciar em modo desenvolvimento
npm run build      # Build para produção
npm run preview    # Visualizar build de produção
```

### PostgreSQL

```powershell
# Conectar ao banco
psql -U postgres -d cred_management

# Comandos dentro do psql
\dt                    # Listar tabelas
\d users              # Ver estrutura da tabela users
\d clients            # Ver estrutura da tabela clients
\d proposals          # Ver estrutura da tabela proposals
SELECT * FROM users;   # Ver todos os usuários
\q                     # Sair
```

---

## ❌ Resolução de Problemas

### Erro: "Porta 3001 já está em uso"

```powershell
# Verificar qual processo está usando a porta
netstat -ano | findstr :3001

# Matar o processo (substitua PID pelo número encontrado)
taskkill /PID numero_do_pid /F
```

### Erro: "Não consegue conectar ao PostgreSQL"

1. Verifique se o PostgreSQL está rodando:
   - Abra "Serviços" (services.msc)
   - Procure por "postgresql"
   - Certifique-se que está "Em execução"

2. Verifique as credenciais no arquivo `.env`

3. Teste a conexão:
```powershell
psql -U postgres
```

### Erro: "Cannot find module"

```powershell
# Limpar e reinstalar dependências
cd backend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install

cd ../frontend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Erro: "CORS" ou "Network Error"

- Verifique se o backend está rodando na porta 3001
- Verifique o `API_URL` em `frontend/src/config.ts`
- Certifique-se que ambos (backend e frontend) estão rodando

---

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas:

1. **users** - Usuários do sistema
2. **clients** - Cadastro de clientes
3. **client_benefits** - Benefícios dos clientes (múltiplos por cliente)
4. **proposals** - Propostas de crédito
5. **benefit_organs** - Órgãos de benefício (pré-cadastrados)

### Relacionamentos:

- Um cliente pode ter vários benefícios
- Um cliente pode ter várias propostas
- Uma proposta está vinculada a um cliente e opcionalmente a um benefício
- Usuários criam e gerenciam clientes e propostas

---

## 🎯 Próximos Passos

Após inicializar o sistema:

1. ✅ Faça login com `>[USUARIO_REMOVIDO]<<` / `>[SENHA_REMOVIDA]<<`
2. ✅ Explore o Dashboard
3. ✅ Crie um usuário de teste
4. ⏳ Implemente os formulários (veja COMPLEMENTAR.md)
5. ⏳ Teste o cadastro de clientes
6. ⏳ Teste o cadastro de propostas
7. ⏳ Configure para rede local
8. ⏳ Treine sua equipe

---

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs do backend no terminal
2. Verifique o console do navegador (F12)
3. Consulte o README.md para mais detalhes
4. Consulte o COMPLEMENTAR.md para implementação

---

**🎉 Parabéns! Seu sistema está pronto para uso!**

Lembre-se de:
- Alterar a senha do admin após primeiro login
- Fazer backup regular do banco de dados
- Manter o sistema atualizado
- Treinar os usuários no sistema

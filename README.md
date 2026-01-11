# Cred Management + 🏦

Sistema completo de gestão de carteira de clientes e propostas de empréstimos com design premium.

## 🚀 Tecnologias

### Backend

- Node.js + Express + TypeScript
- PostgreSQL
- JWT Authentication
- bcryptjs para hash de senhas
- Zod para validação

### Frontend

- React + Vite + TypeScript
- Tailwind CSS + Shadcn/ui
- React Hook Form + Zod
- Axios
- Zustand (gerenciamento de estado)
- Recharts (gráficos e relatórios)

## 📋 Funcionalidades

- ✅ Sistema de login com autenticação JWT
- ✅ Níveis de acesso: Admin (CRUD completo) e Usuário (CRU - sem delete)
- ✅ Cadastro completo de clientes com validação de CPF
- ✅ Busca de endereço via CEP
- ✅ Gestão de propostas de crédito
- ✅ Integração automática entre clientes e propostas
- ✅ Suporte a múltiplos benefícios por cliente
- ✅ Códigos INSS e bancos pré-cadastrados
- ✅ Relatórios avançados
- ✅ Design responsivo e premium

## 🛠️ Instalação

### 1. Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 12+ instalado e rodando
- Git

### 2. Clonar e instalar dependências

```bash
# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### 3. Configurar PostgreSQL

Abra o terminal do PostgreSQL (psql):

```bash
psql -U postgres
```

Execute os comandos:

```sql
-- Criar banco de dados
CREATE DATABASE cred_management;

-- Conectar ao banco
\c cred_management

-- As tabelas serão criadas automaticamente pelo script
```

### 4. Configurar variáveis de ambiente

Crie o arquivo `backend/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:suasenha@localhost:5432/cred_management
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789
NODE_ENV=development
```

**⚠️ IMPORTANTE:** Altere `suasenha` para a senha do seu PostgreSQL e gere uma chave secreta forte para JWT_SECRET.

### 5. Configurar o banco de dados

```bash
cd backend
npm run db:setup
```

Isso criará todas as tabelas e o usuário admin padrão:
- **Login:** >[USUARIO_REMOVIDO]<<
- **Senha:** >[SENHA_REMOVIDA]<<

### 6. Iniciar o sistema

Em um terminal na raiz do projeto:

```bash
npm run dev
```

Ou inicie separadamente:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 7. Acessar o sistema

Abra o navegador em: <http://localhost:5173>

## 🌐 Acesso em Rede Local

Para permitir que outros computadores da rede acessem:

1. **Descubra o IP da máquina servidor:**

   ```bash
   ipconfig
   ```

   Procure por "Endereço IPv4" (ex: 192.168.1.100)

2. **Configure o frontend** para usar o IP do backend:
   
   Edite `frontend/src/config.ts` e altere para:

   ```typescript
   export const API_URL = 'http://192.168.1.100:3001';
   ```

3. **Inicie o frontend em modo rede:**

   ```bash
   cd frontend
   npm run dev -- --host
   ```

4. **Nos outros computadores**, acesse:

   ```text
   http://192.168.1.100:5173
   ```

## 👥 Criando Usuários

### Via SQL (psql)

```sql
-- Conectar ao banco
\c cred_management

-- Criar usuário admin
INSERT INTO users (username, password, full_name, role) 
VALUES ('joao', '$2a$10$...hash...', 'João Silva', 'admin');

-- Criar usuário comum
INSERT INTO users (username, password, full_name, role) 
VALUES ('maria', '$2a$10$...hash...', 'Maria Santos', 'user');
```

Para gerar o hash da senha, use o script auxiliar:

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('suasenha', 10));"
```

### Via Interface Admin

1. Faça login como admin
2. Acesse o menu "Usuários"
3. Clique em "Novo Usuário"
4. Preencha os dados e salve

## 📊 Níveis de Acesso

### Admin

- ✅ Criar clientes e propostas
- ✅ Visualizar todos os dados
- ✅ Editar clientes e propostas
- ✅ Excluir clientes e propostas
- ✅ Gerenciar usuários
- ✅ Acessar relatórios completos

### Usuário

- ✅ Criar clientes e propostas
- ✅ Visualizar todos os dados
- ✅ Editar clientes e propostas
- ❌ Não pode excluir
- ❌ Não pode gerenciar usuários

## 🏗️ Estrutura do Projeto

```text
cred-management-plus/
├── backend/
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── middleware/     # Autenticação e validação
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── scripts/        # Scripts de setup
│   │   └── server.ts       # Entrada da aplicação
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Comunicação com API
│   │   ├── store/          # Estado global
│   │   ├── utils/          # Funções auxiliares
│   │   └── App.tsx         # Componente principal
│   └── package.json
└── README.md
```

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Proteção contra CORS
- Rate limiting
- Helmet.js para headers de segurança
- Validação de dados com Zod

## 📝 Suporte

Para dúvidas ou problemas, verifique:
1. Se o PostgreSQL está rodando
2. Se as credenciais do banco estão corretas no `.env`
3. Se as portas 3001 e 5173 estão disponíveis
4. Se o firewall permite conexões na rede local

## 📄 Licença

Uso interno da empresa.

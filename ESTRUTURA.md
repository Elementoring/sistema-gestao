# 📁 Estrutura Completa do Projeto

```
sistema-gestao/
│
├── 📄 README.md                    # Documentação principal
├── 📄 INICIO-RAPIDO.md             # Guia de instalação rápida
├── 📄 COMPLEMENTAR.md              # Guia de desenvolvimento
├── 📄 STATUS.md                    # Status atual do projeto
├── 📄 ESTRUTURA.md                 # Este arquivo
├── 📄 package.json                 # Scripts principais
├── 📄 .gitignore                   # Arquivos ignorados pelo Git
├── 🔧 start-system.ps1             # Script para iniciar o sistema
├── 🔧 setup-database.ps1           # Script para configurar o banco
│
├── 📂 backend/                     # SERVIDOR API
│   ├── 📄 package.json             # Dependências do backend
│   ├── 📄 tsconfig.json            # Configuração TypeScript
│   ├── 📄 .env.example             # Exemplo de variáveis de ambiente
│   ├── 📄 .env                     # Variáveis de ambiente (criar)
│   ├── 📄 .gitignore               # Ignorar node_modules, dist, .env
│   ├── 📄 usuarios.sql             # Script SQL para criar usuários
│   │
│   └── 📂 src/
│       ├── 📄 server.ts            # 🚀 Servidor principal
│       │
│       ├── 📂 config/
│       │   └── 📄 database.ts      # 🗄️ Conexão PostgreSQL
│       │
│       ├── 📂 middleware/
│       │   └── 📄 auth.ts          # 🔐 Autenticação JWT
│       │
│       ├── 📂 routes/
│       │   ├── 📄 auth.ts          # 🔑 Login e validação
│       │   ├── 📄 clients.ts       # 👥 CRUD de clientes
│       │   ├── 📄 proposals.ts     # 📋 CRUD de propostas
│       │   └── 📄 users.ts         # 👤 CRUD de usuários (admin)
│       │
│       └── 📂 scripts/
│           └── 📄 setup-db.ts      # 🔨 Setup do banco de dados
│
└── 📂 frontend/                    # INTERFACE WEB
    ├── 📄 index.html               # HTML principal
    ├── 📄 package.json             # Dependências do frontend
    ├── 📄 tsconfig.json            # Config TypeScript
    ├── 📄 tsconfig.node.json       # Config TypeScript (Node)
    ├── 📄 vite.config.ts           # Config Vite
    ├── 📄 tailwind.config.js       # Config Tailwind CSS
    ├── 📄 postcss.config.js        # Config PostCSS
    ├── 📄 .gitignore               # Ignorar node_modules, dist
    │
    └── 📂 src/
        ├── 📄 main.tsx             # 🚀 Entrada da aplicação
        ├── 📄 App.tsx              # 🎯 Componente principal + rotas
        ├── 📄 index.css            # 🎨 Estilos globais
        ├── 📄 config.ts            # ⚙️ Configurações (API URL)
        │
        ├── 📂 components/
        │   ├── 📂 ui/              # 🎨 Componentes UI base
        │   │   ├── 📄 button.tsx
        │   │   ├── 📄 input.tsx
        │   │   ├── 📄 label.tsx
        │   │   └── 📄 card.tsx
        │   │
        │   ├── 📂 layout/
        │   │   └── 📄 DashboardLayout.tsx  # Layout com sidebar
        │   │
        │   ├── 📂 clients/         # (A IMPLEMENTAR)
        │   │   ├── ClientForm.tsx
        │   │   ├── ClientTable.tsx
        │   │   └── ClientModal.tsx
        │   │
        │   └── 📂 proposals/       # (A IMPLEMENTAR)
        │       ├── ProposalForm.tsx
        │       ├── ProposalTable.tsx
        │       └── ProposalModal.tsx
        │
        ├── 📂 pages/
        │   ├── 📄 LoginPage.tsx            # 🔐 Página de login
        │   ├── 📄 DashboardPage.tsx        # 📊 Dashboard
        │   ├── 📄 ClientsPage.tsx          # 👥 Gestão de clientes
        │   ├── 📄 ProposalsPage.tsx        # 📋 Gestão de propostas
        │   ├── 📄 ReportsPage.tsx          # 📈 Relatórios
        │   └── 📄 UsersPage.tsx            # 👤 Gestão de usuários
        │
        ├── 📂 services/
        │   ├── 📄 api.ts                   # 🌐 Configuração Axios
        │   ├── 📄 authService.ts           # 🔑 Serviço de auth
        │   └── 📄 dataService.ts           # 📡 Serviços de dados
        │
        ├── 📂 store/
        │   └── 📄 authStore.ts             # 💾 Estado global (Zustand)
        │
        ├── 📂 types/
        │   └── 📄 index.ts                 # 📝 Interfaces TypeScript
        │
        ├── 📂 lib/
        │   └── 📄 utils.ts                 # 🛠️ Funções utilitárias
        │
        └── 📂 data/
            ├── 📄 benefitSpecies.ts        # 📋 Códigos INSS
            └── 📄 banks.ts                 # 🏦 Códigos de bancos
```

## 📊 Fluxo de Dados

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ HTTP Requests
       │ (Axios)
       ↓
┌─────────────┐
│   Vite Dev  │
│   Server    │
│  :5173      │
└──────┬──────┘
       │
       │ API Calls
       ↓
┌─────────────┐
│   Express   │
│   Server    │
│  :3001      │
└──────┬──────┘
       │
       │ SQL Queries
       ↓
┌─────────────┐
│ PostgreSQL  │
│   Database  │
│  :5432      │
└─────────────┘
```

## 🔄 Fluxo de Autenticação

```
1. Usuário faz login
   ↓
2. Backend valida credenciais
   ↓
3. Backend gera token JWT
   ↓
4. Frontend armazena token (localStorage via Zustand)
   ↓
5. Todas as requisições incluem o token
   ↓
6. Backend valida token em cada requisição
   ↓
7. Se válido, processa a requisição
   ↓
8. Se inválido, retorna erro 401
```

## 🗄️ Estrutura do Banco de Dados

```sql
┌─────────────────┐
│     users       │  (Usuários do sistema)
├─────────────────┤
│ id (PK)         │
│ username        │
│ password        │
│ full_name       │
│ role            │  (admin/user)
│ active          │
└─────────────────┘
        │
        │ created_by (FK)
        ↓
┌─────────────────┐
│    clients      │  (Clientes)
├─────────────────┤
│ id (PK)         │
│ cpf             │
│ full_name       │
│ birth_date      │
│ age             │
│ rg, mother_name │
│ address...      │
│ created_by (FK) │
└─────────────────┘
        │
        │ client_id (FK)
        ↓
┌─────────────────┐
│ client_benefits │  (Benefícios dos clientes)
├─────────────────┤
│ id (PK)         │
│ client_id (FK)  │
│ benefit_organ   │
│ benefit_number  │
│ benefit_species │
│ bank_code       │
│ account...      │
└─────────────────┘
        │
        │ benefit_id (FK)
        ↓
┌─────────────────┐
│   proposals     │  (Propostas de crédito)
├─────────────────┤
│ id (PK)         │
│ client_id (FK)  │
│ benefit_id (FK) │
│ proposal_date   │
│ contract_value  │
│ installments... │
│ status          │
└─────────────────┘
```

## 🎯 Principais Funcionalidades por Arquivo

### Backend

| Arquivo | Responsabilidade |
|---------|------------------|
| `server.ts` | Inicializa servidor, middlewares, rotas |
| `database.ts` | Conexão e queries PostgreSQL |
| `auth.ts` (middleware) | Valida JWT, controla permissões |
| `auth.ts` (routes) | Login e validação de token |
| `clients.ts` | CRUD completo de clientes |
| `proposals.ts` | CRUD completo de propostas |
| `users.ts` | CRUD de usuários (admin apenas) |
| `setup-db.ts` | Cria tabelas e usuário inicial |

### Frontend

| Arquivo | Responsabilidade |
|---------|------------------|
| `main.tsx` | Inicializa React |
| `App.tsx` | Rotas e proteção de páginas |
| `LoginPage.tsx` | Tela de login |
| `DashboardPage.tsx` | Dashboard com estatísticas |
| `DashboardLayout.tsx` | Layout com sidebar |
| `ClientsPage.tsx` | Listagem de clientes |
| `authStore.ts` | Estado global de autenticação |
| `api.ts` | Configuração Axios + interceptors |
| `authService.ts` | Serviços de autenticação |
| `dataService.ts` | Serviços de clientes, propostas |
| `utils.ts` | Formatação, validação CPF |
| `benefitSpecies.ts` | Códigos INSS |
| `banks.ts` | Códigos de bancos |

## 📦 Dependências Principais

### Backend
- `express` - Framework web
- `pg` - Cliente PostgreSQL
- `bcryptjs` - Hash de senhas
- `jsonwebtoken` - Autenticação JWT
- `zod` - Validação de dados
- `cors` - CORS
- `helmet` - Segurança HTTP
- `dotenv` - Variáveis de ambiente

### Frontend
- `react` - Biblioteca UI
- `react-router-dom` - Roteamento
- `axios` - Cliente HTTP
- `zustand` - Estado global
- `react-hook-form` - Formulários
- `zod` - Validação
- `tailwindcss` - CSS
- `lucide-react` - Ícones
- `recharts` - Gráficos

## 🚀 Comandos de Desenvolvimento

```powershell
# Instalar tudo
cd backend && npm install
cd ../frontend && npm install

# Configurar banco
cd backend && npm run db:setup

# Desenvolvimento
npm run dev                    # Inicia tudo
cd backend && npm run dev      # Só backend
cd frontend && npm run dev     # Só frontend

# Build para produção
npm run client:build           # Build frontend
npm run server:build           # Build backend

# Scripts PowerShell
.\setup-database.ps1           # Setup do banco
.\start-system.ps1             # Inicia tudo automaticamente
```

## 📝 Arquivos de Configuração

| Arquivo | Propósito |
|---------|-----------|
| `.env` | Variáveis de ambiente (backend) |
| `tsconfig.json` | Configuração TypeScript |
| `vite.config.ts` | Configuração Vite |
| `tailwind.config.js` | Configuração Tailwind |
| `package.json` | Dependências e scripts |

## 🎨 Padrões de Código

### Backend
- TypeScript estrito
- Async/await para queries
- Try/catch para erros
- Validação com Zod
- Responses padronizados

### Frontend
- TypeScript + React 18
- Hooks funcionais
- Componentes reutilizáveis
- Tailwind para estilos
- React Hook Form para formulários

## 🔐 Segurança Implementada

✅ Senhas criptografadas (bcrypt)
✅ Autenticação JWT
✅ Validação de dados (Zod)
✅ CORS configurado
✅ Rate limiting
✅ Helmet.js (headers seguros)
✅ Sanitização de inputs
✅ Controle de permissões (RBAC)

## 📈 Próximos Passos

1. ✅ Estrutura base criada
2. ⏳ Implementar formulários completos
3. ⏳ Adicionar gráficos de relatórios
4. ⏳ Implementar paginação
5. ⏳ Adicionar testes
6. ⏳ Deploy em produção

---

**Estrutura criada com ❤️ para gestão de crédito premium!**

# 🌐 Configuração CORS - Cred Management+

## ✅ Configuração Completa e Robusta

Este documento explica como o sistema está configurado para **NUNCA ter erros de CORS** em nenhum ambiente.

---

## 🎯 Origens Permitidas

### 🏠 Desenvolvimento Local
- `http://localhost:5173` - Vite dev server (porta padrão)
- `http://localhost:5174` - Vite dev server (porta alternativa)
- `http://127.0.0.1:5173` - Localhost via IP
- `http://127.0.0.1:5174` - Localhost IP alternativo
- `http://localhost:3000` - Create React App (caso necessário)
- `http://127.0.0.1:3000` - CRA via IP

### 💻 Desktop (Electron)
- `file://` - Protocolo de arquivos local do Electron
- Qualquer requisição do app desktop é automaticamente permitida

### ☁️ Produção (Render.com)
- `https://cred-management-frontend.onrender.com` - Frontend em produção
- `https://cred-management-backend.onrender.com` - Backend em produção

---

## 🔧 Como Funciona

### Backend (`backend/src/server.ts`)

```typescript
// 1️⃣ Lê origens do ambiente ou usa lista padrão
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [/* lista padrão */];

// 2️⃣ Valida cada requisição
app.use(cors({
  origin: (origin, callback) => {
    // Sem origin? Permite (Postman, curl, apps mobile)
    if (!origin) return callback(null, true);
    
    // Electron? Permite
    if (origin.startsWith('file://')) return callback(null, true);
    
    // Na lista? Permite
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Dev mode + localhost? Permite
    if (NODE_ENV !== 'production' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Caso contrário, bloqueia
    callback(new Error('Not allowed by CORS'));
  }
}));
```

### Frontend (`frontend/src/config.ts`)

```typescript
// Lê da variável de ambiente ou usa localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## 🚀 Configuração por Ambiente

### 📁 Desenvolvimento Local

**Nenhuma configuração necessária!** O sistema já está pronto.

Se precisar de uma porta diferente:

```bash
# Frontend (.env.local)
VITE_API_URL=http://localhost:3001

# Backend (.env)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 🌍 Produção (Render.com)

**Já configurado no `render.yaml`:**

```yaml
# Backend
envVars:
  - key: ALLOWED_ORIGINS
    value: https://cred-management-frontend.onrender.com,http://localhost:5173

# Frontend
envVars:
  - key: VITE_API_URL
    value: https://cred-management-backend.onrender.com
```

### 💻 Desktop (Electron)

**Automaticamente suportado!** O backend permite `file://` por padrão.

---

## 🔍 Debug e Logs

### Ver logs de CORS no backend:

```bash
# Você verá no console:
🔐 CORS Configuration:
   ALLOWED_ORIGINS env: https://...
   Parsed origins: [...]
   NODE_ENV: production

# Para cada requisição:
🔍 CORS check for origin: https://cred-management-frontend.onrender.com
✅ CORS permitiu origem: https://...

# Se bloqueado:
❌ CORS BLOCKED - Origin: https://...
   Allowed origins: ...
```

### Testar CORS manualmente:

```bash
# Teste com curl
curl -H "Origin: https://cred-management-frontend.onrender.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://cred-management-backend.onrender.com/api/health

# Deve retornar headers:
# Access-Control-Allow-Origin: https://cred-management-frontend.onrender.com
# Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
```

---

## ❌ Problemas Comuns e Soluções

### Erro: "blocked by CORS policy"

**Causa**: Nova origem não está na lista

**Solução**: Adicionar no `render.yaml` ou `.env`:

```yaml
# render.yaml
- key: ALLOWED_ORIGINS
  value: https://nova-origem.com,https://outra.com
```

### Erro: "Origin undefined"

**Causa**: Requisição sem header Origin (normal em alguns casos)

**Solução**: Já está tratado! O sistema permite requisições sem origin.

### Erro no Electron Desktop

**Causa**: `file://` bloqueado

**Solução**: Já está resolvido! O sistema detecta automaticamente `file://`.

### Erro em desenvolvimento

**Causa**: Porta diferente da padrão

**Solução**: 
```bash
# .env.local no frontend
VITE_API_URL=http://localhost:PORTA_DO_BACKEND

# .env no backend
ALLOWED_ORIGINS=http://localhost:PORTA_DO_FRONTEND
```

---

## 🛡️ Headers CORS Configurados

```typescript
{
  credentials: true,              // Permite cookies e auth headers
  methods: [                       // Métodos HTTP permitidos
    'GET', 'POST', 'PUT', 
    'DELETE', 'PATCH', 'OPTIONS'
  ],
  allowedHeaders: [                // Headers permitidos
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: [                // Headers expostos ao frontend
    'Content-Range', 
    'X-Content-Range',
    'X-Total-Count'
  ],
  optionsSuccessStatus: 204,       // Status para preflight
  maxAge: 86400                    // Cache preflight por 24h
}
```

---

## 📋 Checklist de Verificação

- [x] Backend permite localhost (dev)
- [x] Backend permite file:// (desktop)
- [x] Backend permite produção (render.com)
- [x] Frontend sabe URL do backend (VITE_API_URL)
- [x] render.yaml configura ambas variáveis
- [x] Logs detalhados para debug
- [x] Permite requisições sem origin
- [x] Dev mode é mais permissivo
- [x] Produção é mais restritivo
- [x] Credentials habilitado
- [x] Todos métodos HTTP permitidos
- [x] Headers necessários permitidos
- [x] Preflight cache configurado

---

## 🎉 Resultado

Com esta configuração, o sistema **NUNCA terá erro de CORS**:

✅ Funciona em desenvolvimento local  
✅ Funciona no app desktop (Electron)  
✅ Funciona em produção (Render.com)  
✅ Funciona com Postman/curl  
✅ Funciona com apps mobile  
✅ Logs detalhados para debug  
✅ Configuração flexível por ambiente  

---

## 📚 Referências

- [MDN - CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)
- [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [Render.com Environment Variables](https://render.com/docs/environment-variables)

---

**Última atualização**: Janeiro 2026  
**Versão do sistema**: Cred Management+ v1.0.0

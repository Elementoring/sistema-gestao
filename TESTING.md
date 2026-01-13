# Sistema de Gestão de Crédito - Testes

Este documento descreve a estrutura de testes implementada no projeto.

## 📋 Cobertura de Testes

### Backend

**Framework**: Jest + Supertest + ts-jest

**Arquivos de Teste**:

- `auth.middleware.test.ts` - Testes do middleware de autenticação JWT
- `auth.routes.test.ts` - Testes das rotas de autenticação (login)
- `database.test.ts` - Testes da conexão com o banco de dados e validações

**Comandos**:

```bash
npm test              # Executa todos os testes
npm run test:watch    # Executa testes em modo watch
npm run test:coverage # Gera relatório de cobertura
```

### Frontend

**Framework**: Vitest + Testing Library + jsdom

**Arquivos de Teste**:

- `lib/utils.test.ts` - Testes das funções utilitárias (formatação, validação)
- `lib/exportExcel.test.ts` - Testes das funções de exportação para Excel
- `store/authStore.test.ts` - Testes do Zustand store de autenticação
- `components/Button.test.tsx` - Testes do componente Button
- `components/Input.test.tsx` - Testes do componente Input

**Comandos**:

```bash
npm test              # Executa todos os testes
npm run test:ui       # Executa testes com interface visual
npm run test:coverage # Gera relatório de cobertura
```

## 🧪 Testes Implementados

### Backend

#### Autenticação (auth.middleware.test.ts)

- ✅ Validação de token JWT válido
- ✅ Rejeição de requisições sem token
- ✅ Rejeição de token inválido
- ✅ Rejeição de token expirado

#### Rotas de Auth (auth.routes.test.ts)

- ✅ Login com credenciais válidas
- ✅ Rejeição de login sem username
- ✅ Rejeição de login sem password
- ✅ Rejeição de credenciais inválidas

#### Database (database.test.ts)

- ✅ Verificação da função query
- ✅ Validação de CPF correto
- ✅ Rejeição de CPF inválido
- ✅ Validação com formatação

### Frontend (43 testes)

#### Utils (lib/utils.test.ts)

- ✅ Mesclagem de classes CSS (cn)
- ✅ Formatação de CPF
- ✅ Validação de CPF
- ✅ Formatação de telefone
- ✅ Formatação de moeda (BRL)
- ✅ Formatação de data
- ✅ Cálculo de idade

#### ExportExcel (lib/exportExcel.test.ts)

- ✅ Criação de workbook e worksheet
- ✅ Exportação de clientes para Excel
- ✅ Exportação de propostas para Excel
- ✅ Exportação de histórico de status
- ✅ Exportação de interações

#### AuthStore (store/authStore.test.ts)

- ✅ Estado inicial (user e token nulos)
- ✅ Definir usuário
- ✅ Definir token
- ✅ Logout (limpar estado)
- ✅ Verificação de autenticação
- ✅ Verificação de role admin

#### Componentes UI

- ✅ Button: renderização, variantes, estado disabled
- ✅ Input: renderização, digitação, disabled, type

## 📊 Estatísticas

### Resultados Atuais

**Backend**:

- Total de Suítes: 3
- Testes Passando: 13/13
- Taxa de Sucesso: 100% ✅

**Frontend**:

- Total de Suítes: 5
- Testes Passando: 43/43
- Taxa de Sucesso: 100% ✅

## 🚀 Como Executar

### Executar Todos os Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Executar com Cobertura

```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run test:coverage
```

### Modo Watch (Frontend)

```bash
cd frontend
npm test
# Pressione 'a' para executar todos os testes
# Pressione 'q' para sair
```

## 🔧 Configuração

### Backend (jest.config.js)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ]
};
```

### Frontend (vitest.config.ts)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

## 📝 Notas

- Os testes estão configurados para rodar automaticamente antes do commit (pre-commit hook)
- A cobertura de código é gerada automaticamente ao executar `npm run test:coverage`
- Testes de integração E2E podem ser adicionados no futuro usando Playwright ou Cypress

## 🎯 Próximos Passos

- [ ] Aumentar cobertura de testes de rotas (clients, proposals, users)
- [ ] Adicionar testes E2E com Playwright
- [ ] Implementar testes de performance
- [ ] Configurar CI/CD com execução automática de testes
- [ ] Adicionar testes de acessibilidade

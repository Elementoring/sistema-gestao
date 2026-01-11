# 🔒 AVISO DE SEGURANÇA

## ⚠️ IMPORTANTE - LEIA ANTES DE USAR

Este é um sistema de gestão completo. Para garantir a segurança:

### 🔐 Credenciais Padrão

**Usuário:** admin  
**Senha:** admin123

### ✅ AÇÕES OBRIGATÓRIAS APÓS INSTALAÇÃO:

1. **ALTERE A SENHA PADRÃO IMEDIATAMENTE**
2. Configure variáveis de ambiente (.env) com suas próprias credenciais
3. Nunca commite arquivos .env no git
4. Use senhas fortes (mínimo 12 caracteres, letras, números, símbolos)
5. Habilite autenticação de dois fatores se disponível

### 🚫 NUNCA FAÇA:

- ❌ Use credenciais padrão em produção
- ❌ Compartilhe senhas em texto plano
- ❌ Commite arquivos .env no repositório
- ❌ Use a mesma senha em múltiplos ambientes

### ✅ BOAS PRÁTICAS:

- ✅ Use variáveis de ambiente para senhas
- ✅ Rotacione senhas regularmente
- ✅ Use gerenciadores de senha
- ✅ Mantenha backups seguros
- ✅ Configure SSL/TLS em produção

### 📋 Configuração Segura

Crie um arquivo `.env` no backend com:

```env
DATABASE_URL=postgresql://usuario:SENHA_SEGURA@localhost:5432/cred_management
JWT_SECRET=GERE_UMA_CHAVE_SECRETA_FORTE_AQUI
PORT=3001
NODE_ENV=production
```

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

**🔒 A segurança do seu sistema depende de você!**

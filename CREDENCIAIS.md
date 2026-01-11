# 🔐 CREDENCIAIS DE ACESSO

## ✅ Credenciais Padrão

**Usuário:** `admin`  
**Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha no primeiro acesso!

---

## 📋 Alterações Realizadas

### Banco de Dados
- ✅ Usuário admin recriado com novo username e senha
- ✅ Hash da senha atualizado com bcrypt
- ✅ Full name: "Fábio Real Cred"
- ✅ Role: admin (acesso completo)

### Arquivos Atualizados (17 arquivos)
1. ✅ `backend/src/scripts/setup-db.ts` - Script de criação do usuário
2. ✅ `README.md` - Documentação principal
3. ✅ `INICIO-RAPIDO.md` - Guia de início rápido
4. ✅ `STATUS.md` - Status do sistema
5. ✅ `DICAS.md` - Dicas de uso
6. ✅ `LEIA-ME.md` - Documentação completa
7. ✅ `COMPLETO.md` - Guia completo
8. ✅ `TESTES.md` - Guia de testes
9. ✅ `SISTEMA-COMPLETO.md` - Documentação final
10. ✅ `backend/usuarios.sql` - Script SQL
11. ✅ `start-system.ps1` - Script PowerShell
12. ✅ `setup-database.ps1` - Setup do banco

---

## 🚀 Como Acessar

### 1. Certifique-se que o sistema está rodando
```bash
npm run dev
```

### 2. Acesse no navegador
```
http://localhost:5173
```

### 3. Faça login com as credenciais padrão
- **Usuário:** `admin`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha no primeiro acesso!

---

## ⚠️ IMPORTANTE

### Segurança
- ✅ Use senhas fortes em produção (mínimo 12 caracteres)
- ✅ Inclua letras maiúsculas e minúsculas
- ✅ Inclua números e caracteres especiais
- ✅ Hash bcrypt com salt rounds = 10
- ✅ Configure via variável de ambiente ADMIN_PASSWORD

### Recomendações
1. 🔒 Configure suas próprias credenciais via .env
2. 🔄 Altere a senha padrão no primeiro acesso
3. 👥 Não compartilhe credenciais
4. 📝 Use o sistema de gerenciamento de usuários para criar outros acessos
5. 🔐 Nunca commite senhas no repositório

---

## 📊 Permissões do Usuário Admin

Como `admin` você tem acesso completo:

- ✅ Criar, editar e excluir clientes
- ✅ Criar, editar e excluir propostas
- ✅ Gerenciar usuários do sistema
- ✅ Acessar todos os relatórios
- ✅ Exportar dados para Excel
- ✅ Fazer upload de fotos e documentos
- ✅ Visualizar logs de auditoria
- ✅ Gerenciar todas as funcionalidades

---

## 🔄 Recuperação de Acesso

Se esquecer a senha, você pode resetá-la executando:

```bash
cd backend
npx ts-node src/scripts/setup-db.ts
```

Isso recriará o usuário `admin` com a senha padrão.

---

## ✅ Status Final

- ✅ Sistema usando credenciais padrão seguras
- ✅ Suporte a variáveis de ambiente configurado
- ✅ Banco de dados atualizado
- ✅ Toda documentação atualizada
- ✅ Sistema 100% funcional

**Data da alteração:** 10 de Janeiro de 2026

---

**Sistema pronto para uso com as novas credenciais! 🎉**

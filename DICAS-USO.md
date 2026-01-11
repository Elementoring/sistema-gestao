# 💡 DICAS DE USO - CRED MANAGEMENT +

## 🎯 DICAS PRÁTICAS PARA O DIA A DIA

---

## 📋 FLUXO DE TRABALHO RECOMENDADO

### 1️⃣ **Início do Dia**
```
1. Fazer login
2. Ver Dashboard para ter visão geral
3. Verificar propostas pendentes
4. Verificar relatórios do dia anterior
```

### 2️⃣ **Atendimento ao Cliente**
```
1. Ir em "Clientes"
2. Buscar por CPF ou nome
3. Se não existir: "Novo Cliente"
4. Cadastrar todos os dados
5. Adicionar todos os benefícios do cliente
```

### 3️⃣ **Criação de Proposta**
```
1. Ir em "Propostas"
2. Clicar "Nova Proposta"
3. Digitar CPF do cliente
4. Clicar "Buscar"
5. Sistema preenche tudo automaticamente!
6. Selecionar benefício (se múltiplos)
7. Preencher dados do contrato
8. Salvar
```

---

## ⚡ ATALHOS E TRUQUES

### Auto-Complete Mágico
- **Espécie INSS**: Digite só o número (ex: `41`)
- **Banco**: Digite só o código (ex: `033`)
- **CEP**: Digite e clique "Buscar"

### Busca Rápida
- Use `Ctrl + F` no navegador para buscar na página
- A busca filtra em tempo real
- Busque por: nome, CPF, status, banco, etc

### Edição Rápida
- Clique no ícone de lápis para editar
- Todos os dados já vêm preenchidos
- Altere apenas o que precisa

---

## 🎨 CÓDIGOS MAIS USADOS

### Espécies INSS Comuns:
```
41 - Aposentadoria por idade
42 - Aposentadoria por tempo de contribuição  
21 - Pensão por morte previdenciária
32 - Aposentadoria por invalidez
46 - Aposentadoria especial
87 - Amparo assistencial ao portador de deficiência (LOAS)
88 - Amparo assistencial ao idoso (LOAS)
```

### Bancos Principais:
```
001 - Banco do Brasil
033 - Santander
104 - Caixa Econômica Federal  
237 - Bradesco
341 - Itaú
422 - Banco Safra
318 - Banco BMG
623 - Banco Panamericano
```

### Órgãos Mais Comuns:
```
INSS - Instituto Nacional do Seguro Social
SIAPE - Sistema Integrado de Administração de RH
GOVERNO - Servidores públicos estaduais
PREFEITURA - Servidores municipais
```

---

## 📊 DICAS DE RELATÓRIOS

### Melhor Período para Análise:
- **7 dias**: Para acompanhamento diário
- **30 dias**: Para análise mensal
- **90 dias**: Para tendências trimestrais
- **Todo período**: Para visão geral histórica

### O que Analisar:
1. **Taxa de Aprovação**: Acima de 70% é bom
2. **Ticket Médio**: Quanto maior, melhor
3. **Status**: Mais "Aprovadas" = Boa performance
4. **Bancos**: Diversificar é importante

---

## 🔐 DICAS DE SEGURANÇA

### Senhas:
- ✅ Use senhas fortes (mín 8 caracteres)
- ✅ Misture letras, números e símbolos
- ✅ Não use senhas óbvias
- ✅ Troque periodicamente

### Permissões:
- **Admin**: Somente pessoas de confiança
- **User**: Para operadores do dia a dia
- Desative usuários que saíram da empresa

### Dados Sensíveis:
- Não compartilhe CPFs fora do sistema
- Não tire prints com dados de clientes
- Faça logout ao sair

---

## 💾 DICAS DE BACKUP

### Backup do Banco de Dados:
```powershell
# Fazer backup manual
pg_dump -U postgres cred_management > backup.sql

# Restaurar backup
psql -U postgres cred_management < backup.sql
```

### Backup Automático (Recomendado):
Configure um script para backup diário:
```powershell
# backup-daily.ps1
$date = Get-Date -Format "yyyy-MM-dd"
pg_dump -U postgres cred_management > "backup-$date.sql"
```

---

## 🚀 DICAS DE PERFORMANCE

### Para Sistema Mais Rápido:
1. Feche abas não usadas no navegador
2. Limpe o cache periodicamente (`Ctrl + Shift + Del`)
3. Use Chrome ou Edge (mais rápidos)
4. Não abra muitos modais ao mesmo tempo

### Para Busca Mais Rápida:
1. Use filtros específicos
2. Busque por CPF quando possível (mais rápido)
3. Não deixe a busca vazia com muitos registros

---

## 🎯 CASOS DE USO ESPECIAIS

### Cliente com Múltiplos Benefícios:
```
Exemplo: Aposentado que também recebe pensão
1. Cadastrar cliente
2. Adicionar benefício 1 (aposentadoria)
3. Clicar "Adicionar Benefício"
4. Adicionar benefício 2 (pensão)
5. Na proposta, sistema pergunta qual usar
```

### Refinanciamento:
```
1. Buscar cliente existente
2. Criar nova proposta
3. Tipo: "Refinanciamento"
4. Preencher saldo devedor
5. Calcular troco
```

### Portabilidade:
```
1. Buscar cliente
2. Criar nova proposta
3. Tipo: "Portabilidade"
4. Informar banco antigo nas observações
5. Preencher dados do novo contrato
```

---

## 📱 USO EM REDE LOCAL

### Configurar para Outros PCs:

1. **Descobrir seu IP**:
```powershell
ipconfig
```
Anote o IPv4 (ex: 192.168.1.100)

2. **Configurar Frontend**:
Editar `frontend/src/config.ts`:
```typescript
export const API_URL = 'http://192.168.1.100:3001';
```

3. **Iniciar com Host**:
```powershell
cd frontend
npm run dev -- --host
```

4. **Acessar de Outros PCs**:
```
http://192.168.1.100:5173
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### "Erro ao salvar cliente"
✅ Verifique se o CPF é válido
✅ Verifique se o CPF já não existe
✅ Preencha todos os campos obrigatórios (*)

### "Cliente não encontrado"
✅ Verifique se digitou o CPF correto
✅ Verifique se o cliente foi cadastrado
✅ Use a busca na página de Clientes

### "Benefício não preenche automaticamente"
✅ Código da espécie deve existir na lista
✅ Código do banco deve existir na lista
✅ Digite o código exato (ex: `41`, não `041`)

### "Gráficos vazios"
✅ Cadastre clientes e propostas primeiro
✅ Aguarde alguns segundos
✅ Atualize a página (F5)

### "Acesso negado"
✅ Faça login novamente
✅ Verifique se tem permissão (admin/user)
✅ Token pode ter expirado (8 horas)

---

## 📈 METAS RECOMENDADAS

### Para Operadores:
- 10+ clientes cadastrados por dia
- 80%+ taxa de aprovação
- 5+ propostas digitadas por dia

### Para Gestores:
- Acompanhar relatórios diariamente
- Meta de crescimento mensal de 10%
- Diversificar bancos parceiros

---

## 🎓 TREINAMENTO DE NOVOS USUÁRIOS

### Dia 1: Básico
- Login e navegação
- Dashboard
- Buscar clientes
- Ver propostas

### Dia 2: Cadastro
- Cadastrar cliente completo
- Adicionar benefícios
- Entender códigos

### Dia 3: Propostas
- Criar proposta
- Usar auto-fill
- Entender status

### Dia 4: Avançado
- Relatórios
- Edição
- Casos especiais

### Dia 5: Prática
- Simulações
- Dúvidas
- Certificação

---

## 🏆 BOAS PRÁTICAS

### ✅ FAÇA:
- Valide CPF antes de cadastrar
- Use busca de CEP para endereços
- Preencha todos os campos possíveis
- Atualize status das propostas
- Faça backup regularmente
- Mantenha dados organizados

### ❌ NÃO FAÇA:
- Não deixe campos importantes vazios
- Não cadastre CPFs inválidos
- Não duplique clientes
- Não compartilhe senha de admin
- Não exclua dados sem confirmar
- Não ignore erros de validação

---

## 💪 MAXIMIZANDO PRODUTIVIDADE

### Prepare Documentos Antes:
- RG do cliente
- Comprovante de endereço
- Contracheque
- Extrato bancário

### Use Atalhos:
- `Tab` para navegar entre campos
- `Enter` para enviar formulário
- `Esc` para fechar modal

### Organize seu Dia:
- Manhã: Cadastros e propostas
- Tarde: Acompanhamento e relatórios
- Fim do dia: Verificar pendências

---

## 🎉 CONCLUSÃO

Com estas dicas você vai:
- ✅ Trabalhar mais rápido
- ✅ Cometer menos erros
- ✅ Ter melhor produtividade
- ✅ Oferecer melhor atendimento

---

**💡 Consulte este guia sempre que precisar!**

**🚀 Bom trabalho com o Cred Management +!**

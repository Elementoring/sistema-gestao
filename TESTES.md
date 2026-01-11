# 🧪 GUIA DE TESTE DO SISTEMA COMPLETO

## ✅ CHECKLIST DE TESTES

Siga este guia para testar todas as funcionalidades implementadas:

---

## 🚀 PASSO 1: INICIAR O SISTEMA

```powershell
# Na raiz do projeto
npm run dev
```

Ou use o script automático:
```powershell
.\start-system.ps1
```

Aguarde até ver:
- ✅ Backend rodando em http://localhost:3001
- ✅ Frontend rodando em http://localhost:5173

---

## 🔐 PASSO 2: LOGIN

1. Abra http://localhost:5173
2. Login: `admin`
3. Senha: `>[SENHA_REMOVIDA]<<`
4. Clique em "Entrar"

**✅ TESTE PASSOU**: Você deve ver o Dashboard

---

## 📊 PASSO 3: TESTAR DASHBOARD

No Dashboard, verifique:
- ✅ Cards com estatísticas (Total, Aprovadas, Pendentes, etc)
- ✅ Gráfico de status de propostas
- ✅ Números atualizando em tempo real
- ✅ Menu lateral funcionando
- ✅ Nome do usuário no topo

---

## 👥 PASSO 4: TESTAR CADASTRO DE CLIENTE

### 4.1 Abrir Modal
1. Clique em "Clientes" no menu
2. Clique em "Novo Cliente"
3. Modal deve abrir

### 4.2 Preencher CPF
1. Digite um CPF válido (ex: `123.456.789-09`)
2. Observe a validação em tempo real
3. ✅ CPF inválido deve mostrar erro
4. ✅ CPF válido não deve mostrar erro

### 4.3 Buscar CEP
1. Digite um CEP (ex: `01310100`)
2. Clique em "Buscar"
3. ✅ Endereço deve preencher automaticamente

### 4.4 Adicionar Benefício
1. Clique em "Adicionar Benefício"
2. Selecione órgão (ex: INSS)
3. Digite matrícula do benefício
4. Digite código da espécie (ex: `41`)
5. ✅ Descrição deve aparecer automaticamente: "Aposentadoria por idade"
6. Digite código do banco (ex: `033`)
7. ✅ Nome do banco deve aparecer: "Santander"
8. Preencha agência e conta
9. Adicione mais benefícios se quiser

### 4.5 Salvar Cliente
1. Preencha os campos obrigatórios (*)
2. Clique em "Salvar Cliente"
3. ✅ Mensagem de sucesso deve aparecer
4. ✅ Cliente deve aparecer na listagem

---

## 📝 PASSO 5: TESTAR CRIAÇÃO DE PROPOSTA

### 5.1 Abrir Modal
1. Clique em "Propostas" no menu
2. Clique em "Nova Proposta"
3. Modal deve abrir

### 5.2 Buscar Cliente (AUTO-FILL!)
1. Digite o CPF do cliente cadastrado
2. Clique em "Buscar"
3. ✅ **MÁGICA**: Todos os dados devem preencher automaticamente!
   - Nome completo
   - Data de nascimento
   - Idade
   - Celular

### 5.3 Selecionar Benefício (se múltiplos)
Se o cliente tem mais de um benefício:
1. ✅ Popup deve abrir automaticamente
2. ✅ Deve mostrar todos os benefícios do cliente
3. Clique em "Selecionar" no benefício desejado
4. ✅ Dados do benefício devem preencher automaticamente:
   - Órgão do benefício
   - Espécie
   - Número
   - Conta

### 5.4 Preencher Contrato
1. Selecione banco do contrato
2. Digite login do banco
3. Selecione tipo de contrato
4. Digite valor do contrato
5. Digite valor da parcela
6. Digite quantidade de parcelas
7. Selecione status

### 5.5 Salvar Proposta
1. Clique em "Salvar Proposta"
2. ✅ Mensagem de sucesso
3. ✅ Proposta aparece na listagem

---

## 📊 PASSO 6: TESTAR RELATÓRIOS

1. Clique em "Relatórios" no menu
2. ✅ Verifique os KPIs no topo:
   - Total de propostas
   - Valor total
   - Ticket médio
   - Taxa de aprovação

3. ✅ Verifique os gráficos:
   - **Gráfico de pizza**: Propostas por Status
   - **Gráfico de barras**: Clientes por Órgão
   - **Gráfico de linha**: Evolução mensal
   - **Gráfico de barras horizontal**: Top 10 bancos

4. ✅ Teste o filtro de período:
   - Selecione "Últimos 7 dias"
   - ✅ Gráficos devem atualizar
   - Selecione "Todo período"
   - ✅ Gráficos devem mostrar tudo

---

## 👤 PASSO 7: TESTAR GESTÃO DE USUÁRIOS (ADMIN)

### 7.1 Acessar Página
1. Clique em "Usuários" no menu
2. ✅ Página deve abrir (somente admin tem acesso)

### 7.2 Criar Usuário
1. Clique em "Novo Usuário"
2. Preencha:
   - Nome de usuário: `teste`
   - Nome completo: `Usuário Teste`
   - Senha: `123456`
   - Confirmar senha: `123456`
   - Função: `Usuário`
3. Clique em "Salvar Usuário"
4. ✅ Usuário deve aparecer na lista

### 7.3 Editar Usuário
1. Clique no ícone de editar
2. Altere o nome completo
3. Deixe senha em branco (não alterar)
4. Clique em "Salvar"
5. ✅ Mudanças devem aparecer

### 7.4 Desativar/Ativar
1. Clique no badge "Ativo"
2. ✅ Deve mudar para "Inativo"
3. Clique novamente
4. ✅ Deve voltar para "Ativo"

### 7.5 Testar Login com Novo Usuário
1. Faça logout
2. Faça login com:
   - Login: `teste`
   - Senha: `123456`
3. ✅ Deve entrar no sistema
4. ✅ Menu "Usuários" NÃO deve aparecer (não é admin)

---

## 🔍 PASSO 8: TESTAR BUSCA E FILTROS

### Em Clientes:
1. Digite um nome na busca
2. ✅ Lista deve filtrar
3. Limpe a busca
4. ✅ Todos devem aparecer

### Em Propostas:
1. Busque por CPF
2. ✅ Deve filtrar
3. Busque por status
4. ✅ Deve filtrar
5. Busque por banco
6. ✅ Deve filtrar

### Em Usuários:
1. Busque por nome
2. ✅ Deve filtrar

---

## ✏️ PASSO 9: TESTAR EDIÇÃO

### Editar Cliente:
1. Clique no ícone de editar
2. Modal abre com dados preenchidos
3. Altere algo
4. Salve
5. ✅ Mudanças aparecem na lista

### Editar Proposta:
1. Clique no ícone de editar
2. Modal abre com dados preenchidos
3. Altere status
4. Salve
5. ✅ Status atualiza na lista

---

## 🗑️ PASSO 10: TESTAR EXCLUSÃO (ADMIN)

### Excluir Cliente:
1. Clique no ícone de lixeira
2. ✅ Confirmação aparece
3. Confirme
4. ✅ Cliente sumiu da lista

### Excluir Proposta:
1. Clique no ícone de lixeira
2. ✅ Confirmação aparece
3. Confirme
4. ✅ Proposta sumiu da lista

---

## 🎯 TESTES ESPECIAIS

### Teste de Validação CPF:
CPFs válidos para teste:
- `123.456.789-09`
- `111.444.777-35`
- `000.000.001-91`

CPFs inválidos:
- `111.111.111-11` (todos iguais)
- `123.456.789-00` (dígito errado)

### Teste CEP:
CEPs válidos para teste:
- `01310100` - Av. Paulista, São Paulo
- `20040020` - Centro, Rio de Janeiro
- `30130100` - Centro, Belo Horizonte

### Teste Espécies INSS:
Códigos para teste:
- `41` - Aposentadoria por idade
- `21` - Pensão por morte previdenciária
- `42` - Aposentadoria por tempo de contribuição
- `32` - Aposentadoria por invalidez previdenciária

### Teste Bancos:
Códigos para teste:
- `001` - Banco do Brasil
- `033` - Santander
- `104` - Caixa Econômica Federal
- `237` - Bradesco
- `341` - Itaú

---

## ✅ CHECKLIST FINAL

Marque o que testou:

**Autenticação:**
- [ ] Login funcionando
- [ ] Logout funcionando
- [ ] Redirecionamento após login

**Dashboard:**
- [ ] Estatísticas aparecendo
- [ ] Gráfico de status
- [ ] Menu lateral

**Clientes:**
- [ ] Listar clientes
- [ ] Criar cliente
- [ ] Editar cliente
- [ ] Excluir cliente (admin)
- [ ] Busca funcionando
- [ ] Validação de CPF
- [ ] Busca de CEP
- [ ] Auto-complete de espécie
- [ ] Auto-complete de banco
- [ ] Múltiplos benefícios

**Propostas:**
- [ ] Listar propostas
- [ ] Criar proposta
- [ ] Editar proposta
- [ ] Excluir proposta (admin)
- [ ] Busca funcionando
- [ ] Auto-fill por CPF
- [ ] Popup de seleção de benefício
- [ ] Estatísticas

**Relatórios:**
- [ ] Gráfico de pizza (status)
- [ ] Gráfico de barras (órgãos)
- [ ] Gráfico de linha (mensal)
- [ ] Gráfico de barras (bancos)
- [ ] Filtro de período
- [ ] KPIs atualizando

**Usuários (Admin):**
- [ ] Listar usuários
- [ ] Criar usuário
- [ ] Editar usuário
- [ ] Excluir usuário
- [ ] Ativar/Desativar
- [ ] Busca funcionando
- [ ] Estatísticas

---

## 🐛 PROBLEMAS COMUNS

### Erro ao buscar cliente:
- ✅ Verifique se o cliente existe
- ✅ Verifique se o CPF está correto
- ✅ Verifique se o backend está rodando

### Gráficos não aparecem:
- ✅ Cadastre alguns clientes e propostas primeiro
- ✅ Aguarde alguns segundos para carregar

### Modal não abre:
- ✅ Atualize a página (F5)
- ✅ Limpe o cache do navegador

---

## 🎉 CONCLUSÃO

Se todos os testes passaram:

✅ **SISTEMA 100% FUNCIONAL!**

Você agora tem um sistema profissional de gestão de crédito pronto para uso!

---

**🚀 BOM USO DO SEU SISTEMA! 🚀**

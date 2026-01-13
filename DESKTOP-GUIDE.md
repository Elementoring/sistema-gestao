# 🖥️ Guia Completo: Aplicativo Desktop Cred Management+

## 📖 Índice
1. [Visão Geral](#visão-geral)
2. [Como Funciona](#como-funciona)
3. [Instalação e Build](#instalação-e-build)
4. [Distribuição](#distribuição)
5. [Uso do Aplicativo](#uso-do-aplicativo)
6. [Resolução de Problemas](#resolução-de-problemas)

---

## 🎯 Visão Geral

O **Cred Management+ Desktop** é um aplicativo nativo para Windows que fornece uma experiência desktop para o seu sistema de gestão de crédito.

### Características:
- ✅ Aplicativo nativo Windows (.exe)
- ✅ Conecta ao servidor Render (mesmos dados)
- ✅ Instalador profissional
- ✅ Atalhos automáticos (Desktop + Menu Iniciar)
- ✅ Atualizações centralizadas no servidor
- ✅ Multi-usuário (compartilha mesmo banco de dados)

### Requisitos:
- ⚠️ **Internet obrigatória** (conecta ao servidor)
- Windows 10 ou superior (64-bit)
- ~300MB de espaço em disco

---

## 🔄 Como Funciona

```
┌────────────────────────────────────┐
│  Computador 1 (Desktop App)        │
│  ├─ Aplicativo Electron            │──┐
│  └─ Se conecta via API             │  │
└────────────────────────────────────┘  │
                                        │
┌────────────────────────────────────┐  │
│  Computador 2 (Desktop App)        │  │
│  ├─ Aplicativo Electron            │──┤
│  └─ Se conecta via API             │  │
└────────────────────────────────────┘  │
                                        ├──► Render.com
┌────────────────────────────────────┐  │   ├─ Backend API
│  Computador 3 (Desktop App)        │  │   └─ PostgreSQL
│  ├─ Aplicativo Electron            │──┘
│  └─ Se conecta via API             │
└────────────────────────────────────┘
```

**Vantagens:**
- Todos acessam os mesmos dados
- Atualizações no servidor beneficiam todos
- Backup centralizado
- Não precisa instalar PostgreSQL localmente

---

## 🏗️ Instalação e Build

### Passo 1: Preparar Ícone

**IMPORTANTE:** Você precisa de um ícone antes do build!

1. Crie ou baixe um ícone 256x256 ou maior
2. Converta para `.ico` em: https://convertio.co/png-ico/
3. Salve como `icon.ico` em `desktop/assets/`

📝 Veja `desktop/assets/ICON-GUIDE.md` para mais detalhes

### Passo 2: Build Automático (RECOMENDADO)

```powershell
# Execute da raiz do projeto
.\build-desktop.ps1
```

Este script faz tudo automaticamente:
- Instala dependências
- Compila o código
- Gera o executável
- Cria o instalador

### Passo 3: Build Manual

```powershell
# Entre na pasta desktop
cd desktop

# Instale dependências
npm install

# Gere o instalador
npm run dist:win
```

### Resultado

O instalador será gerado em:
```
desktop/release/Cred Management+-Setup-1.0.0.exe
```

Tamanho aproximado: **150-200 MB**

---

## 📦 Distribuição

### Como Distribuir para a Empresa

1. **Copie o instalador**
   - Arquivo: `Cred Management+-Setup-1.0.0.exe`
   - Copie para pendrive, rede compartilhada, ou email

2. **Instalação nos Computadores**
   - Execute o instalador
   - Siga o assistente de instalação
   - Escolha o diretório (padrão: `C:\Users\[user]\AppData\Local\Programs\cred-management-desktop`)
   - Marque opções de atalhos (recomendado: ambos)

3. **Primeira Execução**
   - Clique no atalho da área de trabalho
   - Aguarde carregar (precisa de internet)
   - Faça login com suas credenciais

### Desinstalação

**Via Painel de Controle:**
1. Painel de Controle → Programas → Desinstalar
2. Procure "Cred Management+"
3. Clique em Desinstalar

**Via Pasta de Instalação:**
- Execute `Uninstall Cred Management+.exe`

---

## 💻 Uso do Aplicativo

### Menu do Aplicativo

**Arquivo:**
- `Recarregar` (F5) - Atualiza a página
- `Forçar Recarregar` (Ctrl+F5) - Limpa cache e recarrega
- `Sair` (Alt+F4) - Fecha o aplicativo

**Editar:**
- Desfazer, Refazer, Copiar, Colar, etc.

**Visualizar:**
- `Aumentar Zoom` (Ctrl++)
- `Diminuir Zoom` (Ctrl+-)
- `Zoom Padrão` (Ctrl+0)
- `Tela Cheia` (F11)

**Ajuda:**
- `Sobre` - Informações da versão
- `Ferramentas de Desenvolvedor` (F12) - Debug

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `F5` | Recarregar página |
| `Ctrl+F5` | Forçar recarga |
| `F11` | Tela cheia |
| `F12` | DevTools (debug) |
| `Ctrl++` | Aumentar zoom |
| `Ctrl+-` | Diminuir zoom |
| `Ctrl+0` | Zoom padrão |
| `Alt+F4` | Fechar app |

### Comportamento de Links

- **Links internos**: Abrem no próprio app
- **Links externos**: Abrem no navegador padrão
- **Downloads**: Salvos na pasta Downloads do Windows

---

## 🐛 Resolução de Problemas

### Problema: "Não foi possível conectar ao servidor"

**Causas:**
- Sem internet
- Servidor Render offline/inativo
- Firewall bloqueando

**Soluções:**
1. Verifique sua conexão com internet
2. Acesse https://cred-management-frontend.onrender.com no navegador
3. Se não carregar, o servidor pode estar inativo (Render free tier dorme)
4. Aguarde 1-2 minutos para o servidor "acordar"
5. Clique em "Tentar Novamente" no app

### Problema: Instalador não executa

**Soluções:**
- Execute como Administrador
- Desative antivírus temporariamente
- Verifique se tem espaço em disco (~500MB livre)

### Problema: App não inicia após instalação

**Soluções:**
1. Verifique se instalou corretamente
2. Procure por erros no Event Viewer do Windows
3. Reinstale o aplicativo
4. Verifique se seu Windows está atualizado

### Problema: Tela branca ao abrir

**Causas:**
- Servidor ainda carregando
- Problema de cache

**Soluções:**
1. Aguarde 30 segundos
2. Pressione `Ctrl+F5` para forçar recarga
3. Feche e abra o app novamente
4. Verifique conexão internet

### Problema: Login não funciona

**Causas:**
- Credenciais incorretas
- Servidor com problemas

**Soluções:**
1. Verifique usuário e senha
2. Tente acessar pelo site: https://cred-management-frontend.onrender.com
3. Se funcionar no site mas não no app, reinstale o app

---

## 🔧 Desenvolvimento

### Testar localmente

```powershell
cd desktop
npm run dev
```

### Alterar URL do servidor

Edite `desktop/src/main.ts`:

```typescript
const APP_URL = 'https://sua-nova-url.com';
```

Depois recompile:

```powershell
npm run build
```

### Build apenas para teste (sem instalador)

```powershell
npm run pack
```

---

## 📝 Notas Importantes

1. **Dados centralizados**: Todos os usuários compartilham o mesmo banco de dados
2. **Atualizações**: Mudanças no servidor afetam todos os apps automaticamente
3. **Offline**: Não funciona offline (precisa de conexão constante)
4. **Segurança**: Mesma segurança do site (HTTPS, autenticação, etc.)
5. **Performance**: Depende da velocidade da internet

---

## 📊 Comparação: Web vs Desktop

| Aspecto | Site (Browser) | App Desktop |
|---------|---------------|-------------|
| Instalação | Não precisa | Precisa instalar |
| Ícone Desktop | Não | Sim |
| Menu Nativo | Não | Sim |
| Experiência | Web | Desktop |
| Atualizações | Automáticas | Automáticas |
| Dados | Mesmos | Mesmos |
| Performance | Igual | Igual |

---

## 📞 Suporte

Para problemas:
1. Verifique esta documentação
2. Teste o site no navegador
3. Verifique logs (F12 → Console)
4. Contate o administrador do sistema

---

## ✅ Checklist de Implantação

- [ ] Ícone criado e colocado em `desktop/assets/icon.ico`
- [ ] Build executado com sucesso
- [ ] Instalador gerado em `desktop/release/`
- [ ] Testado em um computador
- [ ] Login funciona corretamente
- [ ] Servidor Render está online
- [ ] Instalador distribuído para a equipe
- [ ] Atalhos criados automaticamente
- [ ] Equipe treinada no uso

---

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Plataforma:** Windows 10+ (64-bit)

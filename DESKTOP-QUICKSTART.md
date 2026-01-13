# 🚀 INÍCIO RÁPIDO - Aplicativo Desktop

## ⚡ 3 Passos para Gerar o Executável

### 1️⃣ Adicionar Ícone
```
📁 Coloque um arquivo icon.ico em: desktop/assets/icon.ico
📖 Veja: desktop/assets/README.md para instruções
```

### 2️⃣ Executar Build
```powershell
# Da raiz do projeto, execute:
.\build-desktop.ps1
```

### 3️⃣ Distribuir
```
📦 O instalador estará em: desktop/release/Cred Management+-Setup-1.0.0.exe
💾 Tamanho: ~150-200 MB
🚀 Distribua para os computadores da empresa
```

---

## 🎯 O que foi criado?

```
desktop/
├── src/
│   └── main.ts           ← Código principal do Electron
├── assets/
│   └── icon.ico          ← [VOCÊ PRECISA ADICIONAR]
├── package.json          ← Configurações e dependências
├── tsconfig.json         ← Config TypeScript
├── README.md             ← Documentação técnica
└── LICENSE.txt           ← Licença MIT
```

---

## ✅ Funcionalidades do App

- ✨ Interface nativa Windows
- 🌐 Conecta ao servidor Render
- 🔒 Mesma autenticação do site
- 💾 Mesmo banco de dados PostgreSQL
- 🔄 Atualizações automáticas do servidor
- 📊 Multi-usuário (dados compartilhados)
- 🎨 Menu em português
- ⌨️ Atalhos de teclado
- 🔍 Controle de zoom
- ⚠️ Tratamento de erros

---

## 📋 Requisitos

### Para BUILD (seu computador):
- ✅ Node.js 18+ instalado
- ✅ Windows 10+ (64-bit)
- ✅ ~2GB de espaço livre
- ✅ Ícone icon.ico preparado

### Para USAR (computadores da empresa):
- ✅ Windows 10+ (64-bit)
- ✅ ~300MB de espaço
- ✅ Conexão com internet (obrigatório)

---

## 🐛 Problemas Comuns

### Build falha
- ❌ **Falta ícone**: Adicione `icon.ico` em `desktop/assets/`
- ❌ **Sem Node.js**: Instale do https://nodejs.org/
- ❌ **Erro de dependências**: Execute `npm install` novamente

### App não abre
- ❌ **Sem internet**: Verifique conexão
- ❌ **Servidor offline**: Aguarde 1-2 min (Render free tier)
- ❌ **Antivírus**: Adicione exceção temporariamente

---

## 📖 Documentação Completa

Para mais detalhes, veja:
- 📘 `DESKTOP-GUIDE.md` - Guia completo
- 📘 `desktop/README.md` - Documentação técnica
- 📘 `desktop/assets/README.md` - Guia de ícones

---

## 🎓 Como Usar o App (para usuários)

1. **Instalar**: Execute o instalador `.exe`
2. **Abrir**: Clique no atalho da área de trabalho
3. **Login**: Use suas credenciais normais
4. **Usar**: Igual ao site, mas em janela nativa!

---

## 💡 Vantagens vs Site

| Aspecto | Site | App Desktop |
|---------|------|-------------|
| Ícone no Desktop | ❌ | ✅ |
| Janela Dedicada | ❌ | ✅ |
| Menu Nativo | ❌ | ✅ |
| Atalhos Teclado | Limitado | ✅ Completo |
| Zoom Facilitado | Ctrl+Scroll | Ctrl+/- |
| Sensação | Web | Nativo |

**Dados e funcionalidades são IDÊNTICOS!** 🎯

---

## ⚠️ Importante

- 🌐 **Internet obrigatória**: App se conecta ao servidor
- 💾 **Dados centralizados**: Todos compartilham mesmo banco
- 🔄 **Atualizações**: Feitas no servidor, beneficiam todos
- 🔒 **Segurança**: Mesma do site (HTTPS + JWT)

---

## 🎬 Próximos Passos

1. [ ] Adicionar ícone em `desktop/assets/icon.ico`
2. [ ] Executar `.\build-desktop.ps1`
3. [ ] Testar instalador em um computador
4. [ ] Distribuir para a equipe
5. [ ] Treinar usuários

---

**Pronto para começar?** Execute `.\build-desktop.ps1` 🚀

# Cred Management+ Desktop

Aplicativo desktop para o Sistema de Gestão de Crédito Consignado.

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- Windows 10 ou superior

### Instalar dependências

```bash
cd desktop
npm install
```

## 🚀 Desenvolvimento

Execute o aplicativo em modo de desenvolvimento:

```bash
npm run dev
```

## 🏗️ Build

### Gerar executável para Windows

```bash
npm run dist:win
```

O instalador será gerado em `desktop/release/Cred Management+-Setup-1.0.0.exe`

### Apenas testar o build (sem gerar instalador)

```bash
npm run pack
```

## 📋 Funcionalidades

- ✅ Interface nativa do Windows
- ✅ Conecta ao servidor no Render
- ✅ Menu em português
- ✅ Atalhos de teclado
- ✅ Controle de zoom
- ✅ Tratamento de erros de conexão
- ✅ Links externos abrem no navegador
- ✅ Instalador completo com atalhos

## 🔧 Configuração

O aplicativo está configurado para conectar em:
`https://cred-management-frontend.onrender.com`

Para alterar a URL, edite o arquivo `src/main.ts`:

```typescript
const APP_URL = 'sua-url-aqui';
```

## 📦 Distribuição

O instalador gerado em `release/` pode ser distribuído para os computadores da empresa.

### Processo de instalação:
1. Execute o arquivo `Cred Management+-Setup-1.0.0.exe`
2. Escolha o diretório de instalação
3. O instalador criará:
   - Atalho na área de trabalho
   - Atalho no menu iniciar
   - Entrada no painel de controle para desinstalação

## 📝 Requisitos do Sistema

- **SO**: Windows 10 (64-bit) ou superior
- **RAM**: 4GB mínimo (8GB recomendado)
- **Espaço**: ~300MB para instalação
- **Internet**: Conexão ativa necessária

## 🐛 Problemas Conhecidos

- Requer conexão com internet para funcionar
- Depende da disponibilidade do servidor Render

## 📄 Licença

MIT License - veja LICENSE.txt

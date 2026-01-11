# Script PowerShell para facilitar o uso do sistema
# Salve como: start-system.ps1

Write-Host "
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        🏦  CRED MANAGEMENT + STARTER                     ║
║        Iniciando o sistema completo...                   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Verificar se as dependências estão instaladas
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
}

# Verificar se o arquivo .env existe
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "Copiando .env.example para .env..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "
⚠️  ATENÇÃO: Edite o arquivo backend\.env e configure:
   - A senha do PostgreSQL
   - O JWT_SECRET (opcional, mas recomendado)
   
Pressione Enter após configurar o .env..." -ForegroundColor Red
    Read-Host
}

Write-Host "
🚀 Iniciando o sistema...
   - Backend: http://localhost:3001
   - Frontend: http://localhost:5173
   
📌 Login padrão: >[USUARIO_REMOVIDO]<< / >[SENHA_REMOVIDA]<<

Para parar o sistema, pressione Ctrl+C em ambas as janelas.
" -ForegroundColor Green

# Abrir nova janela do PowerShell para o backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🔧 Backend iniciando...' -ForegroundColor Cyan; npm run dev"

# Aguardar 3 segundos antes de iniciar o frontend
Start-Sleep -Seconds 3

# Abrir nova janela do PowerShell para o frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '🎨 Frontend iniciando...' -ForegroundColor Cyan; npm run dev"

# Aguardar 5 segundos e abrir o navegador
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Write-Host "
✅ Sistema iniciado com sucesso!
   O navegador será aberto automaticamente.
   
📝 Documentação:
   - README.md - Visão geral
   - INICIO-RAPIDO.md - Instalação
   - COMPLEMENTAR.md - Desenvolvimento
   - STATUS.md - Status do projeto
   
" -ForegroundColor Green

# Script de Setup do Banco de Dados
# Salve como: setup-database.ps1

Write-Host "
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        🗄️  CRED MANAGEMENT + DATABASE SETUP              ║
║        Configurando o banco de dados...                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Verificar se o PostgreSQL está instalado
$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgPath) {
    Write-Host "❌ PostgreSQL não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o PostgreSQL antes de continuar." -ForegroundColor Yellow
    Write-Host "Download: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit
}

Write-Host "✅ PostgreSQL encontrado!" -ForegroundColor Green

# Perguntar credenciais
$dbUser = Read-Host "Nome do usuário PostgreSQL (padrão: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

Write-Host "
Criando banco de dados 'cred_management'...
(Digite a senha do PostgreSQL quando solicitado)
" -ForegroundColor Yellow

# Criar banco de dados
$createDbCommand = "CREATE DATABASE cred_management;"
$createDbCommand | psql -U $dbUser -c $createDbCommand postgres

# Verificar se as dependências do backend estão instaladas
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
}

# Executar script de setup
Write-Host "
🔧 Criando tabelas e dados iniciais...
" -ForegroundColor Yellow

cd backend
npm run db:setup
cd ..

Write-Host "
✅ Banco de dados configurado com sucesso!

👤 Usuário padrão criado:
   Login: admin
   Senha: admin123

⚠️  IMPORTANTE: Altere a senha padrão no primeiro acesso!
⚠️  Use a variável de ambiente ADMIN_PASSWORD para definir senha personalizada.

📝 Próximos passos:
   1. Execute: .\start-system.ps1
   2. Ou execute manualmente: npm run dev (na raiz)
   3. Acesse: http://localhost:5173
   
" -ForegroundColor Green

Read-Host "Pressione Enter para sair"

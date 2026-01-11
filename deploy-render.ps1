# Script PowerShell de deploy para Render.com

Write-Host "🚀 Iniciando configuração para deploy no Render.com..." -ForegroundColor Cyan

# 1. Verificar se estamos no diretório correto
if (-not (Test-Path "render.yaml")) {
    Write-Host "❌ Erro: Arquivo render.yaml não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto." -ForegroundColor Yellow
    exit 1
}

# 2. Verificar se o código está commitado
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Existem mudanças não commitadas." -ForegroundColor Yellow
    Write-Host "Fazendo commit automático..." -ForegroundColor Cyan
    git add .
    git commit -m "chore: Configuração para deploy no Render.com"
}

# 3. Push para o GitHub
Write-Host "📤 Enviando código para o GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Código enviado para o GitHub com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Acesse: https://dashboard.render.com" -ForegroundColor White
    Write-Host "2. Clique em 'New +' > 'Blueprint'" -ForegroundColor White
    Write-Host "3. Selecione o repositório: Elementoring/sistema-gestao" -ForegroundColor White
    Write-Host "4. Clique em 'Apply'" -ForegroundColor White
    Write-Host ""
    Write-Host "O Render criará automaticamente:" -ForegroundColor Yellow
    Write-Host "  ✅ PostgreSQL Database" -ForegroundColor Green
    Write-Host "  ✅ Backend API" -ForegroundColor Green
    Write-Host "  ✅ Frontend" -ForegroundColor Green
    Write-Host ""
    Write-Host "Após o deploy inicial:" -ForegroundColor Cyan
    Write-Host "  1. Vá no backend > Environment" -ForegroundColor White
    Write-Host "  2. Configure ALLOWED_ORIGINS com a URL do frontend" -ForegroundColor White
    Write-Host "     Exemplo: https://cred-management-frontend.onrender.com" -ForegroundColor Gray
    Write-Host "  3. No frontend > Environment, configure VITE_API_URL" -ForegroundColor White
    Write-Host "     Exemplo: https://cred-management-backend.onrender.com" -ForegroundColor Gray
    Write-Host "  4. No backend > Shell, execute: npm run db:setup" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Sistema pronto para deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📖 Para instruções detalhadas, leia: DEPLOY-GUIDE.md" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erro ao enviar para o GitHub!" -ForegroundColor Red
    Write-Host "Verifique sua conexão e tente novamente." -ForegroundColor Yellow
}

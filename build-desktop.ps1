# Script para gerar o aplicativo desktop
# Execute este arquivo no PowerShell

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cred Management+ - Build Desktop App" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se esta na pasta correta
if (!(Test-Path "desktop")) {
    Write-Host "[ERRO] Execute este script da raiz do projeto!" -ForegroundColor Red
    Write-Host "   Use: cd sistema-gestao" -ForegroundColor Yellow
    exit 1
}

# Entra na pasta desktop
Set-Location desktop

Write-Host "[INFO] Verificando dependencias..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "[INFO] Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Erro ao instalar dependencias!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[OK] Dependencias ja instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "[INFO] Compilando TypeScript..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro ao compilar!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Compilacao concluida!" -ForegroundColor Green
Write-Host ""

# Verifica se existe icone
if (!(Test-Path "assets/icon.ico")) {
    Write-Host "[AVISO] Icone nao encontrado!" -ForegroundColor Yellow
    Write-Host "   Coloque um arquivo 'icon.ico' em 'desktop/assets/'" -ForegroundColor Yellow
    Write-Host "   Veja: desktop/assets/ICON-GUIDE.md" -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "Continuar mesmo sem icone? (s/N)"
    if ($continue -ne "s" -and $continue -ne "S") {
        Write-Host "[ERRO] Build cancelado!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[INFO] Gerando executavel Windows..." -ForegroundColor Yellow
Write-Host "   (Isso pode levar alguns minutos...)" -ForegroundColor Gray
Write-Host ""

npm run dist:win

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERRO] Erro ao gerar executavel!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  [OK] BUILD CONCLUIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Instalador gerado em:" -ForegroundColor Cyan
Write-Host "   desktop/release/Cred Management+-Setup-1.0.0.exe" -ForegroundColor White
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "   1. Localize o instalador na pasta 'release'" -ForegroundColor White
Write-Host "   2. Distribua para os computadores da empresa" -ForegroundColor White
Write-Host "   3. Execute o instalador em cada maquina" -ForegroundColor White
Write-Host ""
Write-Host "Dica: O aplicativo requer internet para funcionar!" -ForegroundColor Cyan
Write-Host ""

# Abre a pasta release
$openFolder = Read-Host "Abrir pasta do instalador? (S/n)"
if ($openFolder -ne "n" -and $openFolder -ne "N") {
    Invoke-Item "release"
}

Set-Location ..

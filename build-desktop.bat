@echo off
echo ============================================
echo  Cred Management+ - Build Desktop App
echo ============================================
echo.

cd /d "%~dp0desktop"

echo [INFO] Compilando TypeScript...
call npm run build
if errorlevel 1 (
    echo [ERRO] Falha na compilacao!
    pause
    exit /b 1
)

echo.
echo [INFO] Gerando instalador Windows...
echo (Isso pode levar 3-5 minutos, aguarde...)
echo.

call npx electron-builder --win --config.win.signAndEditExecutable=false

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao gerar instalador!
    pause
    exit /b 1
)

echo.
echo ============================================
echo  [OK] BUILD CONCLUIDO COM SUCESSO!
echo ============================================
echo.
echo Instalador gerado em:
echo   desktop\release\Cred Management+-Setup-1.0.0.exe
echo.
pause

explorer release

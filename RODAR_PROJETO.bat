@echo off
chcp 65001 >nul
echo ========================================================
echo      CURSO DE GESTÃO FINANCEIRA - SETUP AUTOMÁTICO
echo ========================================================
echo.
echo Este script vai instalar todas as dependências e iniciar o projeto.
echo Por favor, aguarde...
echo.

:: 1. Verificar Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js não encontrado! Por favor, instale o Node.js antes de continuar.
    pause
    exit /b
)

:: 2. Backend
echo [1/4] 📦 Instalando dependências do Backend (Servidor)...
cd backend
call npm install --silent
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependências do Backend.
    pause
    exit /b
)

echo [2/4] 🚀 Iniciando Servidor Backend na porta 3002...
start "SERVIDOR BACKEND (Não feche)" cmd /k "node server.js"
cd ..

:: 3. Frontend
echo.
echo [3/4] 🎨 Instalando dependências do Frontend (Site)...
call npm install --silent
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependências do Frontend.
    pause
    exit /b
)

echo [4/4] 🌐 Iniciando Site na porta 6300...
echo.
echo ========================================================
echo   TUDO PRONTO! O SITE ABRIRÁ EM SEU NAVEGADOR.
echo   Se não abrir, acesse: http://localhost:6300
echo ========================================================
echo.

start http://localhost:6300
call npm run dev
pause

@echo off
title Sistema Soderia Nico - Iniciando...
color 0A
cls

echo.
echo  ======================================================
echo    SISTEMA SODERIA NICO - Panel de Administracion
echo  ======================================================
echo.
echo  [1/2] Iniciando Backend (API)...
echo.

:: Iniciar Backend en ventana separada
start "Backend - FastAPI" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

:: Esperar 3 segundos para que el backend arranque
timeout /t 3 /nobreak >nul

echo  [2/2] Iniciando Panel Admin (Frontend)...
echo.

:: Iniciar Frontend en ventana separada
start "Frontend - Panel Admin" cmd /k "cd /d "%~dp0base_soderia_admin" && npx vite --port 5173"

:: Esperar 5 segundos para que Vite compile
timeout /t 5 /nobreak >nul

echo  [OK] Abriendo Panel de Administracion en el navegador...
echo.

:: Abrir el navegador
start "" "http://localhost:5173"

echo.
echo  ======================================================
echo    Sistema iniciado correctamente!
echo  ======================================================
echo.
echo   Panel Admin:  http://localhost:5173
echo   API Backend:  http://localhost:8000
echo   Docs API:     http://localhost:8000/docs
echo.
echo   Usuario: admin
echo   Pass:    123456
echo.
echo  Podes cerrar esta ventana. El sistema sigue corriendo
echo  en las otras dos ventanas abiertas.
echo.
pause

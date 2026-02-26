@echo off
title Detener Sistema Soderia Nico
color 0C
cls

echo.
echo  Deteniendo todos los procesos del sistema...
echo.

:: Matar procesos de Python (backend uvicorn)
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im python3.exe >nul 2>&1

:: Matar procesos de Node.js (frontend vite)
taskkill /f /im node.exe >nul 2>&1

echo  [OK] Sistema detenido correctamente.
echo.
pause

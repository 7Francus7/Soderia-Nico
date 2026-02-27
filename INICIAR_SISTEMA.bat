@echo off
title Sodería Nico v2.0 - Premium Edition
color 0B
cls

echo.
echo  ======================================================
10: echo    SODERIA NICO - SISTEMA DE GESTION ELITE v2.0
11: echo  ======================================================
12: echo.
13: echo  [1/2] Verificando entorno y base de datos...
14: echo.
15: 
16: cd /d "%~dp0soderia_next"
17: 
18: :: Asegurarse de que prisma este generado
19: call npx prisma generate
20: 
21: echo.
22: echo  [2/2] Iniciando Servidor de Aplicacion...
23: echo.
24: 
25: :: Iniciar Next.js en ventana separada
26: start "Soderia Nico - App Server" cmd /k "npm run dev"
27: 
28: :: Esperar unos segundos para el arranque
29: timeout /t 8 /nobreak >nul
30: 
31: echo.
32: echo  [OK] Abriendo el Sistema...
33: echo.
34: 
35: :: Abrir el navegador en el puerto 3000
36: start "" "http://localhost:3000"
37: 
38: echo  ======================================================
39: echo    Sistema iniciado en: http://localhost:3000
40: echo  ======================================================
41: echo.
42: echo   Usuario por defecto: admin
43: echo   Pass por defecto:    123456
44: echo.
45: echo   (Podes cerrar esta ventana)
46: echo.
47: pause

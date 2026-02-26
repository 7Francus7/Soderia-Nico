@echo off
cd backend
if not exist venv (
    echo Creando entorno virtual...
    python -m venv venv
)
echo Activando entorno...
call venv\Scripts\activate
echo Instalando dependencias...
pip install -r requirements.txt
echo Inicializando base de datos...
python initial_data.py
echo.
echo ========================================================
echo  TODO LISTO! 
echo  El servidor se iniciara ahora.
echo  Documentacion API (Swagger): http://localhost:8000/docs
echo ========================================================
echo.
uvicorn app.main:app --reload
pause

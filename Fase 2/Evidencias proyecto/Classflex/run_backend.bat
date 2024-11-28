@echo off

cd classflex
echo Ejecutando migraciones de login...
python manage.py makemigrations login

echo Insertando datos iniciales de login...
python insert_initial_data.py
if %errorlevel% neq 0 (
    echo Error al insertar roles iniciales.
    pause
    exit /b %errorlevel%
)
echo Ejecutando migraciones de main...
python manage.py makemigrations main

echo Buscando posibles migraciones pendientes...
python manage.py makemigrations

echo Migrando a la base de datos...
python manage.py migrate

echo Iniciando servidor de Django...
python manage.py runserver

echo Servidor iniciado.
echo Presiona la combinación de botones Ctrl + C para detener el batch.

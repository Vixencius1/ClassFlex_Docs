# Proyecto Classflex 📚
###

<div align="left">
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" height="40" alt="django logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" height="40" alt="microsoftsqlserver logo"  />
</div>

###

Este es un proyecto iniciado por motivo de proyecto final de la asignatura de Capstone, de la carrera de Ingeniería en Informática.

###

## Guía de instalación - Primer Paso

### Ambiente Virtual

Este backend se basa en Python 3.11, y debe ejecutarse con un ambiente virtual. Para crear uno, puedes ejecutar en la terminal `py -m venv ambiente`.
> Para más información de ambientes virtuales, puedes entrar a [esta página](https://docs.python.org/es/3.11/library/venv.html#creating-virtual-environments)

Luego, desde la ruta del ambiente virtual, ejecuta el batchfile en `"Scripts/activate.bat"` para activar el ambiente virtual. Después, instala las librerías utilizadas en el proyecto utilizando el archivo `requirements.txt` como base.<br/>
Desde la terminal, dirígete a la carpeta que contiene el archivo `requirements.txt` y ejecuta `pip install -r requirements.txt` con el ambiente activado.

### Base de Datos

El proyecto utiliza SQL Server con el motor Express como predeterminado. Si deseas utilizar una base de datos alternativa, conecta tu base de datos desde el archivo `settings.py` en el directorio `"classflex\classflex"`.

### Creando usuarios

Una vez que la base de datos está conectada, desde el terminal, dirígete a la carpeta contenedora del proyecto y ejecuta el batch `run_backend.bat`.<br/>
Esto agregará datos a la base de datos que esté conectada, y registrará usuarios de ejemplo, como:
```
Administrador:
  * Email: admin@example.com
  * Password: Admin123.
  (considera el punto de la contraseña)

Estudiante:
  * Email: student@example.com
  * Password: Alumno123.
  (considera el punto de la contraseña)

Profesor:
  * Email: professor@example.com
  * Password: Profe123.
  (considera el punto de la contraseña)
```
> Este archivo generará también Departamentos, Colegios, Asignaturas y Cursos de ejemplo.

Si necesitas entrar al administrador de Django, crea un superusuario con `py manage.py createsuperuser` en la terminal.

La contraseña debe contener entre 8 y 16 caracteres, al menos una mayúscula, una minúscula y un número.<br>
> Ejemplo: Admin1234

Si necesitas agregar otros usuarios, colegios, asignaturas y otros, debes hacerlo desde el [frontend](#frontend).

## Frontend

Con esto, el backend del proyecto está instalado.<br/>
Para continuar la instalación debes utilizar el repositorio de frontend:
### **[Classflex_Frontend](https://github.com/Basty1420/Classflex_Front)**

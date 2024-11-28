import os
import django

# Configura el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'classflex.settings')
django.setup()

from login.models import Rol
from main.models import *
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

# Crear roles
def insert_initial_roles():
    roles = ['admin', 'student', 'professor']
    for role_name in roles:
        Rol.objects.get_or_create(nombre=role_name, defaults={'comentario': f'Default {role_name} role'})
    print("Roles iniciales insertados correctamente.")

# Crear usuarios
def create_initial_users():
    users = [
        {
            'email': 'admin@example.com',
            'role': 'admin',
            'is_first_login': False,
            'password': 'Admin123.',
            'is_superuser': True,
            'is_staff': True,
        },
        {
            'email': 'student@example.com',
            'role': 'student',
            'is_first_login': False,
            'password': 'Alumno123.'
        },
        {
            'email': 'professor@example.com',
            'role': 'professor',
            'is_first_login': False,
            'password': 'Profe123.'
        },
        
        # Estudiantes de ejemplo
        {'email': 'student1@example.com', 'role': 'student', 'is_first_login': False, 'password': 'B4oLmrmvk6dpPf2H'},
        {'email': 'student2@example.com', 'role': 'student', 'is_first_login': False, 'password': 'meN3PVYhm92'},
        {'email': 'student3@example.com', 'role': 'student', 'is_first_login': False, 'password': 'gKsrp0GGOGPZcWs1'},
        {'email': 'student4@example.com', 'role': 'student', 'is_first_login': False, 'password': '9dU7Eq9ExfA'},
        {'email': 'student5@example.com', 'role': 'student', 'is_first_login': False, 'password': 'Ero1fCNRb'},
        {'email': 'student6@example.com', 'role': 'student', 'is_first_login': False, 'password': '554Sel29PBRX2ep'},
        {'email': 'student7@example.com', 'role': 'student', 'is_first_login': False, 'password': 'DfFo9VOvPLYk'},
        {'email': 'student8@example.com', 'role': 'student', 'is_first_login': False, 'password': '2IY9vRp2YRgvN'},
        {'email': 'student9@example.com', 'role': 'student', 'is_first_login': False, 'password': 's7Jl12PHU'},
        {'email': 'student10@example.com', 'role': 'student', 'is_first_login': False, 'password': '66agSgsLDhcTSE1T'},
        {'email': 'student11@example.com', 'role': 'student', 'is_first_login': False, 'password': 'A2bC3dEfG5'},
        {'email': 'student12@example.com', 'role': 'student', 'is_first_login': False, 'password': 'hJ7kL9mN1pQ'},
        {'email': 'student13@example.com', 'role': 'student', 'is_first_login': False, 'password': 'QwErTy1234'},
        {'email': 'student14@example.com', 'role': 'student', 'is_first_login': False, 'password': 'ZxCvBnM6pQw'},
        {'email': 'student15@example.com', 'role': 'student', 'is_first_login': False, 'password': '1A2b3C4d5E'},
        {'email': 'student16@example.com', 'role': 'student', 'is_first_login': False, 'password': 'Y8uI9oP0qR'},
        {'email': 'student17@example.com', 'role': 'student', 'is_first_login': False, 'password': 'L0mN1pQ2rS'},
        {'email': 'student18@example.com', 'role': 'student', 'is_first_login': False, 'password': 'F6gH7jK8lM9'},
        {'email': 'student19@example.com', 'role': 'student', 'is_first_login': False, 'password': 'T4eR5tY6uI'},
        {'email': 'student20@example.com', 'role': 'student', 'is_first_login': False, 'password': 'P1o2I3u4Y5'},
        {'email': 'student21@example.com', 'role': 'student', 'is_first_login': False, 'password': 'W3eR4tY5uI9'},
        {'email': 'student22@example.com', 'role': 'student', 'is_first_login': False, 'password': '8A9b0C1d2E3'},
        {'email': 'student23@example.com', 'role': 'student', 'is_first_login': False, 'password': 'XyZ1aB2cD3e'},
        {'email': 'student24@example.com', 'role': 'student', 'is_first_login': False, 'password': '7Jk8L9mN0pQ'},
        {'email': 'student25@example.com', 'role': 'student', 'is_first_login': False, 'password': '5A6b7C8d9E0'},
        {'email': 'student26@example.com', 'role': 'student', 'is_first_login': False, 'password': 'Q1wE2rT3yU4'},
        {'email': 'student27@example.com', 'role': 'student', 'is_first_login': False, 'password': 'Z9xY8wV7uX6'},
        {'email': 'student28@example.com', 'role': 'student', 'is_first_login': False, 'password': 'L1mN2oP3qR4'},
        {'email': 'student29@example.com', 'role': 'student', 'is_first_login': False, 'password': 'T5gH6jK7lM8'},
        {'email': 'student30@example.com', 'role': 'student', 'is_first_login': False, 'password': 'F2eR3tY4uI5'},
        {'email': 'student31@example.com', 'role': 'student', 'is_first_login': False, 'password': 'G3hJ4kL5mN6'},
        {'email': 'student32@example.com', 'role': 'student', 'is_first_login': False, 'password': '1Qw2Er3Ty4'},
        {'email': 'student33@example.com', 'role': 'student', 'is_first_login': False, 'password': 'A5sD6fG7hJ8'},
        {'email': 'student34@example.com', 'role': 'student', 'is_first_login': False, 'password': '9Zx8Yw7V6u5'},
        {'email': 'student35@example.com', 'role': 'student', 'is_first_login': False, 'password': 'B2nM3vC4xD5'},
        {'email': 'student36@example.com', 'role': 'student', 'is_first_login': False, 'password': '7R8tY9uI0oP'},
        {'email': 'student37@example.com', 'role': 'student', 'is_first_login': False, 'password': 'N1mQ2wE3rT4'},
        {'email': 'student38@example.com', 'role': 'student', 'is_first_login': False, 'password': 'C5vB6nM7kL8'},
        {'email': 'student39@example.com', 'role': 'student', 'is_first_login': False, 'password': '8T7gH6jK5l4'},
        {'email': 'student40@example.com', 'role': 'student', 'is_first_login': False, 'password': 'P1o2I3u4Y5'},
        
        # Profesores de ejemplo
        {'email': 'professor1@example.com', 'role': 'professor', 'is_first_login': False, 'password': 'n7LVBg1Q9tgqUE'},
        {'email': 'professor2@example.com', 'role': 'professor', 'is_first_login': False, 'password': 'yVxxau6I7'},
        {'email': 'professor3@example.com', 'role': 'professor', 'is_first_login': False, 'password': 'Hur48hzyogdGtp'},
        {'email': 'professor4@example.com', 'role': 'professor', 'is_first_login': False, 'password': 'xLm6OTZ7Iyb'},
        {'email': 'professor5@example.com', 'role': 'professor', 'is_first_login': False, 'password': '5cHg9N3NfWp'},
        {'email': 'professor6@example.com', 'role': 'professor', 'is_first_login': False, 'password': '5Tzv8ZQjN'},
        {'email': 'professor7@example.com', 'role': 'professor', 'is_first_login': False, 'password': 'mSLS2oZu'},
        {'email': 'professor8@example.com', 'role': 'professor', 'is_first_login': False, 'password': 'a68jCnxeG'},
        {'email': 'professor9@example.com', 'role': 'professor', 'is_first_login': False, 'password': '1DYCt08EPjtxFR'},
        {'email': 'professor10@example.com', 'role': 'professor', 'is_first_login': False, 'password': '4qkyYTQIrea4'}
    ]
    
    for user_data in users:
        role = Rol.objects.get(nombre=user_data['role'])
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'role': role,
                'is_first_login': user_data['is_first_login']
            }
        )
        if created:
            user.set_password(user_data['password'])
            user.is_superuser = user_data.get('is_superuser', False)
            user.is_staff = user_data.get('is_superuser', False)
            user.save()
        print(f"Usuario '{user.email}' creado correctamente.")

# Crear departamentos
def insert_initial_departments():
    departments = [
        'Departamento de Lenguaje y Comunicación', 
        'Departamento de Ciencias Naturales y Exactas', 
        'Departamento de Historia y Ciencias Sociales', 
        'Departamento de Matemáticas Aplicadas', 
        'Departamento de Artes y Humanidades', 
        'Departamento de Innovación y Tecnología'
    ]
    for department in departments:
        Departamento.objects.get_or_create(departamento=department)
    print("Departamentos iniciales insertados correctamente.")

# Crear colegios
def insert_initial_schools():
    schools = [
        {
            'nombre': 'Colegio Santa María',
            'direccion': 'Av. Siempreviva 742',
            'ciudad': 'Springfield',
            'region': 'Región Metropolitana',
            'contacto': '123456789',
            'email': 'contacto@santamaria.cl'
        },
        {
            'nombre': 'Instituto Nacional',
            'direccion': 'Calle Libertad 123',
            'ciudad': 'Santiago',
            'region': 'Región Metropolitana',
            'contacto': '987654321',
            'email': 'info@institutonacional.cl'
        },
        {
            'nombre': 'Liceo Bicentenario',
            'direccion': 'Calle Educación 456',
            'ciudad': 'Valparaíso',
            'region': 'Región de Valparaíso',
            'contacto': '555666777',
            'email': 'info@liceobicentenario.cl'
        },
        {
            'nombre': 'Escuela República',
            'direccion': 'Calle Independencia 789',
            'ciudad': 'Concepción',
            'region': 'Región del Bío-Bío',
            'contacto': '444555666',
            'email': 'contacto@escuelarepublica.cl'
        },
        {
            'nombre': 'Academia Internacional',
            'direccion': 'Av. Principal 1011',
            'ciudad': 'La Serena',
            'region': 'Región de Coquimbo',
            'contacto': '333444555',
            'email': 'info@academiainternacional.cl'
        }
    ]
    for school in schools:
        Colegio.objects.get_or_create(
            nombre=school['nombre'],
            defaults={
                'direccion': school['direccion'],
                'ciudad': school['ciudad'],
                'region': school['region'],
                'contacto': school['contacto'],
                'email': school['email']
            }
        )
    print("Colegios iniciales insertados correctamente.")

# Crear asignaturas
def insert_initial_subjects():
    subjects = [
        {
            'asignatura': 'Matemáticas',
            'descripcion': 'Descripción de Matemáticas',
            'departamento': Departamento.objects.get(departamento='Departamento de Matemáticas Aplicadas'),
            'colegio': Colegio.objects.get(nombre='Instituto Nacional')
        },
        {
            'asignatura': 'Lenguaje y Comunicación',
            'descripcion': 'Descripción de Lenguaje y Comunicación',
            'departamento': Departamento.objects.get(departamento='Departamento de Lenguaje y Comunicación'),
            'colegio': Colegio.objects.get(nombre='Instituto Nacional')
        },
        {
            'asignatura': 'Ciencias Naturales',
            'descripcion': 'Descripción de Ciencias Naturales',
            'departamento': Departamento.objects.get(departamento='Departamento de Ciencias Naturales y Exactas'),
            'colegio': Colegio.objects.get(nombre='Instituto Nacional')
        },
        {
            'asignatura': 'Historia y Ciencias Sociales',
            'descripcion': 'Descripción de Historia y Ciencias Sociales',
            'departamento': Departamento.objects.get(departamento='Departamento de Historia y Ciencias Sociales'),
            'colegio': Colegio.objects.get(nombre='Instituto Nacional')
        },
        {
            'asignatura': 'Arte',
            'descripcion': 'Descripción de Arte',
            'departamento': Departamento.objects.get(departamento='Departamento de Artes y Humanidades'),
            'colegio': Colegio.objects.get(nombre='Instituto Nacional')
        }
    ]
    for subject in subjects:
        Asignatura.objects.get_or_create(
            asignatura=subject['asignatura'],
            defaults={
                'descripcion': subject['descripcion'],
                'departamento': subject['departamento'],
                'colegio': subject['colegio']
            }
        )
    print("Asignaturas iniciales insertadas correctamente.")

# Crear administradores
def insert_initial_administradores():
    admin_user = User.objects.get(email='admin@example.com')
    colegio = Colegio.objects.get(nombre='Instituto Nacional')

    administradores = [
        {
            'nombre': 'Juan',
            'apellido_paterno': 'Pérez',
            'apellido_materno': 'González',
            'usuario': admin_user,
            'colegio': colegio
        },
    ]

    for admin_data in administradores:
        Administrador.objects.get_or_create(
            nombre=admin_data['nombre'],
            apellido_paterno=admin_data['apellido_paterno'],
            apellido_materno=admin_data['apellido_materno'],
            usuario=admin_data['usuario'],
            defaults={'colegio': admin_data['colegio']}
        )
    print("Administradores iniciales insertados correctamente.")

# Crear cursos
def insert_initial_cursos():
    colegio = Colegio.objects.get(nombre='Instituto Nacional')
    asignaturas = Asignatura.objects.filter(colegio=colegio)

    cursos = [
        {
            'curso': '1° Básico',
            'nivel': 1,
            'cupos': 30,
            'colegio': colegio,
            'asignaturas': asignaturas
        },
        {
            'curso': '2° Básico',
            'nivel': 2,
            'cupos': 30,
            'colegio': colegio,
            'asignaturas': asignaturas
        },
        {
            'curso': '3° Básico',
            'nivel': 3,
            'cupos': 30,
            'colegio': colegio,
            'asignaturas': asignaturas
        },
        {
            'curso': '4° Básico',
            'nivel': 4,
            'cupos': 30,
            'colegio': colegio,
            'asignaturas': asignaturas
        },
    ]
    
    for curso_data in cursos:
        curso, created = Curso.objects.get_or_create(
            curso=curso_data['curso'],
            defaults={
                'nivel': curso_data['nivel'],
                'cupos': curso_data['cupos'],
                'colegio': curso_data['colegio'],
            }
        )
        if created:
            curso.asignaturas.set(curso_data['asignaturas'])
            curso.save()
        print(f"Curso '{curso.curso}' creado correctamente.")

# Crear profesores
def insert_initial_profesores():
    colegio = Colegio.objects.get(nombre='Instituto Nacional')
    cursos = Curso.objects.filter(colegio=colegio)
    asignaturas = Asignatura.objects.filter(
        colegio=colegio,
        asignatura__in=['Lenguaje y Comunicación', 'Historia y Ciencias Sociales']
    )
    
    emails = [
        'professor@example.com', 'professor1@example.com', 'professor2@example.com',
        'professor3@example.com', 'professor4@example.com', 'professor5@example.com',
        'professor6@example.com', 'professor7@example.com', 'professor8@example.com',
        'professor9@example.com', 'professor10@example.com'
    ]
    
    profesor_user = [User.objects.get(email=email) for email in emails]

    profesores = [
        {
            'rut': '12345678-9',
            'nombre': 'Juan',
            'apellido_paterno': 'Pérez',
            'apellido_materno': 'García',
            'contacto': '934567890',
            'usuario': profesor_user[0],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '18534276-4',
            'nombre': 'Ana',
            'apellido_paterno': 'Soto',
            'apellido_materno': 'López',
            'contacto': '987654321',
            'usuario': profesor_user[1],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '20456987-2',
            'nombre': 'Carlos',
            'apellido_paterno': 'Pérez',
            'apellido_materno': 'Mora',
            'contacto': '912345678',
            'usuario': profesor_user[2],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '16789345-3',
            'nombre': 'Marcela',
            'apellido_paterno': 'Vargas',
            'apellido_materno': 'Fuentes',
            'contacto': '976543210',
            'usuario': profesor_user[3],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '14567832-1',
            'nombre': 'Ricardo',
            'apellido_paterno': 'González',
            'apellido_materno': 'Pino',
            'contacto': '987123456',
            'usuario': profesor_user[4],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '21345678-0',
            'nombre': 'Paula',
            'apellido_paterno': 'Araya',
            'apellido_materno': 'Torres',
            'contacto': '934567891',
            'usuario': profesor_user[5],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '19234567-9',
            'nombre': 'Diego',
            'apellido_paterno': 'Martínez',
            'apellido_materno': 'Lagos',
            'contacto': '945678123',
            'usuario': profesor_user[6],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '18765432-6',
            'nombre': 'Lorena',
            'apellido_paterno': 'Espinoza',
            'apellido_materno': 'Díaz',
            'contacto': '912345678',
            'usuario': profesor_user[7],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '20123456-8',
            'nombre': 'Pablo',
            'apellido_paterno': 'Rodríguez',
            'apellido_materno': 'Guzmán',
            'contacto': '976543210',
            'usuario': profesor_user[8],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '19456789-5',
            'nombre': 'Natalia',
            'apellido_paterno': 'Rojas',
            'apellido_materno': 'Fernández',
            'contacto': '983456789',
            'usuario': profesor_user[9],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        },
        {
            'rut': '18567834-7',
            'nombre': 'Juan',
            'apellido_paterno': 'Herrera',
            'apellido_materno': 'Castro',
            'contacto': '987654321',
            'usuario': profesor_user[10],
            'colegios': [colegio],
            'cursos': cursos,
            'asignaturas': asignaturas
        }
    ]

    for prof_data in profesores:
        prof, created = Profesor.objects.get_or_create(
            rut=prof_data['rut'],
            defaults={
                'nombre': prof_data['nombre'],
                'apellido_paterno': prof_data['apellido_paterno'],
                'apellido_materno': prof_data['apellido_materno'],
                'contacto': prof_data['contacto'],
                'usuario': prof_data['usuario']
            }
        )
        if created:
            prof.colegios.set(prof_data['colegios'])
            prof.cursos.set(prof_data['cursos'])
            prof.asignaturas.set(prof_data['asignaturas'])
            prof.save()
        print(f"Profesor '{prof.nombre} {prof.apellido_paterno}' creado correctamente.")

# Crear alumnos
def insert_initial_alumnos():
    colegio = Colegio.objects.get(nombre='Instituto Nacional')
    curso = Curso.objects.get(curso='1ro Básico')
    
    emails = [
        'student@example.com','student1@example.com','student2@example.com',
        'student3@example.com','student4@example.com','student5@example.com',
        'student6@example.com','student7@example.com','student8@example.com',
        'student9@example.com','student10@example.com','student10@example.com',
        'student11@example.com','student12@example.com','student13@example.com',
        'student14@example.com','student15@example.com','student16@example.com',
        'student17@example.com','student18@example.com','student19@example.com',
        'student20@example.com','student21@example.com','student22@example.com',
        'student23@example.com','student24@example.com','student25@example.com',
        'student26@example.com','student27@example.com','student28@example.com',
        'student29@example.com','student30@example.com','student31@example.com',
        'student32@example.com','student33@example.com','student34@example.com',
        'student35@example.com','student36@example.com','student37@example.com',
        'student38@example.com','student39@example.com','student40@example.com',
    ]
    
    alumno_users = [User.objects.get(email=email) for email in emails]
    
    alumnos = [
        {
            'rut': '21.234.798-4',
            'nombre': 'Carlos',
            'apellido_paterno': 'García',
            'apellido_materno': 'Martínez',
            'direccion': 'Calle Falsa 123',
            'usuario': alumno_users[0],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '19.876.543-2',
            'nombre': 'Sofía',
            'apellido_paterno': 'Fernández',
            'apellido_materno': 'Muñoz',
            'direccion': 'Av. Los Leones 456',
            'usuario': alumno_users[1],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '20.234.567-5',
            'nombre': 'Ignacio',
            'apellido_paterno': 'Pérez',
            'apellido_materno': 'López',
            'direccion': 'Calle Las Flores 789',
            'usuario': alumno_users[2],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '22.345.678-9',
            'nombre': 'Valentina',
            'apellido_paterno': 'González',
            'apellido_materno': 'Rojas',
            'direccion': 'Av. Providencia 1011',
            'usuario': alumno_users[3],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '18.987.654-3',
            'nombre': 'Martín',
            'apellido_paterno': 'Rodríguez',
            'apellido_materno': 'Sánchez',
            'direccion': 'Pasaje Los Olivos 234',
            'usuario': alumno_users[4],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '23.456.789-6',
            'nombre': 'Camila',
            'apellido_paterno': 'Morales',
            'apellido_materno': 'Sepúlveda',
            'direccion': 'Calle Los Almendros 345',
            'usuario': alumno_users[5],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '17.543.210-8',
            'nombre': 'Felipe',
            'apellido_paterno': 'Araya',
            'apellido_materno': 'Torres',
            'direccion': 'Av. Los Pinos 678',
            'usuario': alumno_users[6],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '16.654.321-7',
            'nombre': 'Javiera',
            'apellido_paterno': 'Ramírez',
            'apellido_materno': 'Vega',
            'direccion': 'Pasaje El Bosque 789',
            'usuario': alumno_users[7],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '15.432.109-5',
            'nombre': 'Diego',
            'apellido_paterno': 'Pizarro',
            'apellido_materno': 'Fuentes',
            'direccion': 'Calle Los Alerces 234',
            'usuario': alumno_users[8],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '24.567.890-2',
            'nombre': 'María',
            'apellido_paterno': 'Castro',
            'apellido_materno': 'Carrasco',
            'direccion': 'Av. O´Higgins 567',
            'usuario': alumno_users[9],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '13.765.432-1',
            'nombre': 'Tomás',
            'apellido_paterno': 'Hernández',
            'apellido_materno': 'Soto',
            'direccion': 'Pasaje Los Mañíos 890',
            'usuario': alumno_users[10],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '26.123.456-7',
            'nombre': 'Carlos',
            'apellido_paterno': 'García',
            'apellido_materno': 'Martínez',
            'direccion': 'Calle Falsa 123',
            'usuario': alumno_users[11],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '26.234.567-5',
            'nombre': 'María',
            'apellido_paterno': 'Pérez',
            'apellido_materno': 'López',
            'direccion': 'Avenida Central 45',
            'usuario': alumno_users[12],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '26.345.678-3',
            'nombre': 'Juan',
            'apellido_paterno': 'Hernández',
            'apellido_materno': 'Torres',
            'direccion': 'Pasaje Los Almendros 98',
            'usuario': alumno_users[13],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '26.456.789-1',
            'nombre': 'Ana',
            'apellido_paterno': 'Martínez',
            'apellido_materno': 'González',
            'direccion': 'Calle Principal 10',
            'usuario': alumno_users[14],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '26.567.890-K',
            'nombre': 'Sofía',
            'apellido_paterno': 'Vargas',
            'apellido_materno': 'Muñoz',
            'direccion': 'Villa Las Rosas 7',
            'usuario': alumno_users[15],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '26.678.901-8',
            'nombre': 'Diego',
            'apellido_paterno': 'Sánchez',
            'apellido_materno': 'Morales',
            'direccion': 'Avenida Las Palmas 23',
            'usuario': alumno_users[16],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '26.789.012-6',
            'nombre': 'Martina',
            'apellido_paterno': 'Rodríguez',
            'apellido_materno': 'Espinoza',
            'direccion': 'Pasaje El Sol 19',
            'usuario': alumno_users[17],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '26.890.123-4',
            'nombre': 'Matías',
            'apellido_paterno': 'Rojas',
            'apellido_materno': 'Castillo',
            'direccion': 'Calle Los Arrayanes 77',
            'usuario': alumno_users[18],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.012.345-2',
            'nombre': 'Isidora',
            'apellido_paterno': 'Pino',
            'apellido_materno': 'Carrasco',
            'direccion': 'Avenida El Bosque 101',
            'usuario': alumno_users[19],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.123.456-0',
            'nombre': 'Joaquín',
            'apellido_paterno': 'Fuentes',
            'apellido_materno': 'Navarro',
            'direccion': 'Camino Real 85',
            'usuario': alumno_users[20],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.234.567-8',
            'nombre': 'Valentina',
            'apellido_paterno': 'Molina',
            'apellido_materno': 'Bravo',
            'direccion': 'Calle Los Robles 32',
            'usuario': alumno_users[21],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.345.678-6',
            'nombre': 'Tomás',
            'apellido_paterno': 'Cortés',
            'apellido_materno': 'Salinas',
            'direccion': 'Avenida La Estrella 56',
            'usuario': alumno_users[22],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.456.789-4',
            'nombre': 'Florencia',
            'apellido_paterno': 'Leiva',
            'apellido_materno': 'Riquelme',
            'direccion': 'Pasaje Las Violetas 8',
            'usuario': alumno_users[23],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.567.890-2',
            'nombre': 'Agustín',
            'apellido_paterno': 'Aravena',
            'apellido_materno': 'Figueroa',
            'direccion': 'Calle Las Lilas 45',
            'usuario': alumno_users[24],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.678.901-0',
            'nombre': 'Catalina',
            'apellido_paterno': 'Moreno',
            'apellido_materno': 'Peña',
            'direccion': 'Avenida Las Torres 60',
            'usuario': alumno_users[25],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.789.012-K',
            'nombre': 'Vicente',
            'apellido_paterno': 'Ramírez',
            'apellido_materno': 'Vega',
            'direccion': 'Pasaje Los Ciruelos 90',
            'usuario': alumno_users[26],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '27.890.123-8',
            'nombre': 'Renata',
            'apellido_paterno': 'Alvarado',
            'apellido_materno': 'Campos',
            'direccion': 'Calle Las Acacias 77',
            'usuario': alumno_users[27],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.012.345-6',
            'nombre': 'Lucas',
            'apellido_paterno': 'Gutiérrez',
            'apellido_materno': 'Bustos',
            'direccion': 'Avenida Los Naranjos 10',
            'usuario': alumno_users[28],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.123.456-4',
            'nombre': 'Francisca',
            'apellido_paterno': 'Silva',
            'apellido_materno': 'Saavedra',
            'direccion': 'Camino El Sol 112',
            'usuario': alumno_users[29],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.234.567-2',
            'nombre': 'Sebastián',
            'apellido_paterno': 'Carvajal',
            'apellido_materno': 'Godoy',
            'direccion': 'Pasaje Las Dalias 44',
            'usuario': alumno_users[30],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.345.678-0',
            'nombre': 'Emilia',
            'apellido_paterno': 'Álvarez',
            'apellido_materno': 'Maldonado',
            'direccion': 'Avenida Las Flores 29',
            'usuario': alumno_users[31],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.456.789-K',
            'nombre': 'Ignacio',
            'apellido_paterno': 'Ortiz',
            'apellido_materno': 'Escobar',
            'direccion': 'Calle El Sauce 15',
            'usuario': alumno_users[32],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.567.890-8',
            'nombre': 'Antonia',
            'apellido_paterno': 'Cáceres',
            'apellido_materno': 'Yáñez',
            'direccion': 'Pasaje Los Castaños 9',
            'usuario': alumno_users[33],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.678.901-6',
            'nombre': 'Maximiliano',
            'apellido_paterno': 'Zúñiga',
            'apellido_materno': 'Palacios',
            'direccion': 'Avenida Los Cipreses 98',
            'usuario': alumno_users[34],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.789.012-4',
            'nombre': 'Amparo',
            'apellido_paterno': 'Cruz',
            'apellido_materno': 'Garrido',
            'direccion': 'Calle Los Álamos 66',
            'usuario': alumno_users[35],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '28.890.123-2',
            'nombre': 'Julián',
            'apellido_paterno': 'Lagos',
            'apellido_materno': 'Lara',
            'direccion': 'Pasaje El Aromo 33',
            'usuario': alumno_users[36],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '29.012.345-0',
            'nombre': 'Montserrat',
            'apellido_paterno': 'Venegas',
            'apellido_materno': 'Toro',
            'direccion': 'Avenida Los Olivos 24',
            'usuario': alumno_users[37],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '29.123.456-K',
            'nombre': 'Felipe',
            'apellido_paterno': 'Barros',
            'apellido_materno': 'Huerta',
            'direccion': 'Calle Los Manzanos 72',
            'usuario': alumno_users[38],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '29.234.567-8',
            'nombre': 'Javiera',
            'apellido_paterno': 'Cisternas',
            'apellido_materno': 'Gallardo',
            'direccion': 'Pasaje El Espino 19',
            'usuario': alumno_users[39],
            'colegio': colegio,
            'curso': curso
        },
        {
            'rut': '29.345.678-6',
            'nombre': 'Benjamin',
            'apellido_paterno': 'Olivares',
            'apellido_materno': 'Arriagada',
            'direccion': 'Avenida La Loma 83',
            'usuario': alumno_users[40],
            'colegio': colegio,
            'curso': curso
        }
    ]

    for alumno_data in alumnos:
        Alumno.objects.get_or_create(
            rut=alumno_data['rut'],
            defaults={
                'nombre': alumno_data['nombre'],
                'apellido_paterno': alumno_data['apellido_paterno'],
                'apellido_materno': alumno_data['apellido_materno'],
                'direccion': alumno_data['direccion'],
                'usuario': alumno_data['usuario'],
                'colegio': alumno_data['colegio'],
                'curso': alumno_data['curso']
            }
        )
        print(f"Alumno '{alumno_data['nombre']} {alumno_data['apellido_paterno']}' creado correctamente.")

if __name__ == '__main__':
    insert_initial_roles()
    create_initial_users()
    insert_initial_departments()
    insert_initial_schools()
    insert_initial_subjects()
    insert_initial_administradores()
    insert_initial_cursos()
    insert_initial_profesores()
    insert_initial_alumnos()

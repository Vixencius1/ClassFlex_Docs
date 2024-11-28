from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import re
from django.core.exceptions import ValidationError

# Expresiones regulares para filtrar tipos de email y password aceptados
EMAIL_REGEX = re.compile(r'^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$', re.IGNORECASE)
PASSWORD_REGEX = re.compile(r'^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$')

# Administrador de usuarios, contempla los métodos para crear nuevos usuarios y superusuarios
class UsuarioManager(BaseUserManager):

    # Creación de usuarios normales
    def create_user(self, email, password=None, **extra_fields):

        # Se sobreescriben nombre y apellido
        if not email:
            raise ValueError('El usuario debe tener un correo electrónico')
        
        # Validar que el email esté en un formato permitido
        if not EMAIL_REGEX.match(email):
            raise ValidationError("El formato del correo electrónico es inválido")
        
        # Filtrado de formato email
        email = self.normalize_email(email)

        # Por default, al crearse una cuenta esta tiene un estado de 'activa'
        extra_fields.setdefault('is_active', True)

        # Crea el usuario sin contraseña si no se proporciona una
        user = self.model(email=email, **extra_fields)

        # Solo establece contraseña si se proporciona
        if password:
            if not PASSWORD_REGEX.match(password):
                raise ValidationError("La contraseña debe tener entre 8 y 16 caracteres, "
                                      "incluir al menos una mayúscula, una minúscula y un número.")
            user.set_password(password)  
        else:
            user.set_unusable_password()  # Marca como no usable hasta que el usuario la configure

        user.save(using=self._db)
        return user

    # Crea y guarda un superusuario con el email y contraseña proporcionados.
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_first_login', False)

        # Asignar automáticamente el rol 'admin' sin solicitarlo
        admin_role = Rol.objects.get(nombre='admin')
        extra_fields['role'] = admin_role  # Forzar que sea siempre admin
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Modelo para definir roles de usuario
class Rol(models.Model):
    
    # Definición de roles
    ADMIN = 'admin'
    STUDENT = 'student'
    PROFESSOR = 'professor'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (STUDENT, 'Student'),
        (PROFESSOR, 'Professor'),
    ]

    # Columnas del modelo
    nombre = models.CharField(max_length=20, choices=ROLE_CHOICES)
    comentario = models.TextField(max_length=200, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'Rol'
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'


# Modelo de usuario personalizado, hereda las columnas por defecto de Django
class Usuario(AbstractUser):

    # Obtiene roles de la tabla Rol
    ADMIN = 'admin'
    STUDENT = 'student'
    PROFESSOR = 'professor'

    # Nuevas columnas a agregar
    email = models.CharField(max_length=255, unique=True)
    role = models.ForeignKey(Rol, on_delete=models.CASCADE, default=None, null=True)
    is_first_login = models.BooleanField(default=True)

    # Eliminación de columnas por defecto
    username = None
    first_name = None
    last_name = None

    # Usar email como username para ingresar
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UsuarioManager()

    # Nombre que aparece en el panel de Django admin
    class Meta:
        db_table = 'Usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    # # Funciones para obtener el rol de usuario
    def is_admin(self):
        return self.role.nombre == self.ADMIN

    def is_student(self):
        return self.role.nombre == self.STUDENT

    def is_professor(self):
        return self.role.nombre == self.PROFESSOR
    
# Modelo para guardar token temporal al momento de restablecer contraseña
class PasswordResetToken(models.Model):
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    used = models.BooleanField(default=False)
    expired_at = models.DateTimeField(null=True)
    
    class Meta:
        db_table=  'password_reset_token'
    

# Modelo para guardar token temporal al momento de crear contraseña
class PasswordCreateToken(models.Model):
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    used = models.BooleanField(default=False)
    expired_at = models.DateTimeField(null=True)

    class Meta:
        db_table = 'password_create_token'
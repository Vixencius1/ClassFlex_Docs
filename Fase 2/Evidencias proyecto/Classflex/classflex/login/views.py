from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .serializers import UserSerializer
from .models import Usuario, PasswordResetToken, PasswordCreateToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.hashers import make_password
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.conf import settings
from django.template.loader import get_template
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone
import jwt, datetime
import re
from main.models import Profesor, Administrador, Alumno, Colegio
from main.serializers import ColegioSerializer

# Función para crear correos
def create_mail(email, subject, template_path, context):
    template = get_template(template_path)
    content = template.render(context)

    mail = EmailMultiAlternatives(
        subject = subject,
        body = '',
        from_email = settings.EMAIL_HOST_USER,
        to = [
            email
        ]
    )
    mail.attach_alternative(content, 'text/html')
    return mail

# Permisos personalizados según rol
class IsAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_admin()

class IsStudent(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_student()

class IsProfessor(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_professor()
    
# Vista de api para verificar el token de creación de contraseña
class VerifyCreateTokenView(APIView):

    # Uso de método post
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')

         # Verifica si el UID y el token son obligatorios
        if not uid or not token:
            return Response({'error': 'UID y token son obligatorios'}, status=400)
        
        try:
             # Decodifica el UID y obtiene el ID del usuario
            user_id = urlsafe_base64_decode(uid).decode()
            user = Usuario.objects.get(pk=user_id)

             # Obtiene el token de creación de contraseña
            password_create_token = PasswordCreateToken.objects.get(token=token)

            # Verifica si el token ha expirado
            if password_create_token.expired_at is not None and password_create_token.expired_at < timezone.now():
                return Response({'error': 'El enlace de restablecimiento de contraseña ha expirado.'}, status=400)
            
            # Verifica si el token pertenece al usuario
            if password_create_token.user != user:
                print(f"Error: El token creado no corresponde al usuario.")
                return Response({'error': 'Token inválido.'}, status=400)
            
            # Verifica si el token ya ha sido utilizado
            if password_create_token.used:
                return Response({'error': 'Token has already been used.'}, status=400)
            
            # Marca el token como utilizado
            password_create_token.used = True
            password_create_token.save()
            return Response({'valid': True})
        
        # Devuelve una respuesta con un error si el token no existe
        except PasswordResetToken.DoesNotExist:
            print(f"Error: Token de reinicio de contraseña no existe.")
            return Response({'error': 'Token inválido.'}, status=400)
        
         # Devuelve una respuesta con un error si el usuario no existe
        except Usuario.DoesNotExist:
            print(f"Error: El usuario no existe.")
            return Response({'error': 'Usuario no válido.'}, status=400)
        
        # Devuelve una respuesta con un error si ocurre un evento inesperado durante la solicitud
        except Exception as e:
            return Response({'error': 'Ocurrió un error al verificar el token.'}, status=500)
    
# Vista de interfaz de registro de usuarios
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generar el token para el primer inicio de sesión
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Enlace de creación de contraseña, consumir con frontend
        password_creation_link = f'http://localhost:3000/#/create-password/{uid}/{token}'

        # Se crea el objeto PasswordResetToken en la base de datos
        PasswordCreateToken.objects.create(user=user, token=token)

        # Envía correo al nuevo usuario
        try:
            mail_content = create_mail(
                user.email,
                'Bienvenido a ClassFlex: Crea tu contraseña',
                'login/create_password_email.html',
                {'password_creation_link': password_creation_link}
            )
            mail_content.send(fail_silently=False)
        except Exception as e:
            return Response({'error': 'Error al enviar el correo'}, status=500)
        
        return Response(serializer.data)

# Vista de para crear contraseña en caso de primer inicio de sesión
class CreatePasswordView(APIView):
    def post(self, request):

        # Campos requeridos por la api
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        # Validación en caso de no recibir los campos requeridos
        if not uid or not token or not new_password:
            return Response({'error': 'UID, token y nueva contraseña son obligatorios'}, status=400)
        
        # Validación de la contraseña
        password_regex = re.compile(r'^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$')
        if not password_regex.match(new_password):
            return Response({'error': 'La contraseña debe tener entre 8 y 16 caracteres, incluir al menos una mayúscula, una minúscula y un número.'}, status=400)

        try:
            validate_password(new_password)
        except ValidationError as e:
            return Response({'error': e.messages}, status=400)

        # Decodificar el uid y buscar al usuario
        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = Usuario.objects.get(pk=user_id)
            token_generator = PasswordResetTokenGenerator()

            if token_generator.check_token(user, token):
                # Actualizar la contraseña y cambiar el estado de primer inicio
                user.password = make_password(new_password)
                user.is_first_login = False
                user.save()

                return Response({'message': 'Contraseña creada exitosamente.'})
            else:
                return Response({'error': 'Token inválido.'}, status=400)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no válido.'}, status=400)
        except Exception as e:
            return Response({'error': 'Ocurrió un error al crear la contraseña.'}, status=400)

# Vista de api login, para inicio de sesión
class LoginView(APIView):

    def post(self, request):
        # Campos requeridos por la API
        email = request.data['email']
        password = request.data['password']

        # Buscar usuario por email
        user = Usuario.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('Usuario no encontrado...')

        if not user.check_password(password):
            raise AuthenticationFailed('Contraseña incorrecta...')

        # Obtener los roles asociados (profesor, administrador, alumno)
        profesor = Profesor.objects.filter(usuario=user).first()
        administrador = Administrador.objects.filter(usuario=user).first()
        alumno = Alumno.objects.filter(usuario=user).first()

        # Inicializar el colegio o colegios
        colegios = []
        colegio_id = None
        profesor_id = None
        alumno_id = None

        # Si es profesor, puede estar en múltiples colegios
        if profesor:
            colegios = profesor.colegios.all()
            if not colegios.exists():
                raise AuthenticationFailed('No está asociado a ningún colegio.')
            colegio_id = colegios.first().id
            profesor_id = profesor.id

        elif administrador:
            colegio_id = administrador.colegio.id if administrador.colegio else None
            if colegio_id is None:
                raise AuthenticationFailed('Administrador no está asociado a ningún colegio.')

        elif alumno:
            colegio_id = alumno.colegio.id if alumno.colegio else None
            if colegio_id is None:
                raise AuthenticationFailed('Alumno no está asociado a ningún colegio.')
            alumno_id = alumno.id

        # Crear el token JWT
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow(),
        }

        # Si es profesor, incluir múltiples colegios en el payload
        if profesor:
            payload['colegios'] = [{'id': colegio.id, 'nombre': colegio.nombre} for colegio in colegios]

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)

        # Crear la respuesta condicionalmente
        response.data = {
            'jwt': token,
            'role': user.role.nombre,
            'is_first_login': user.is_first_login,
            'is_active': user.is_active,
            'colegios': [{'id': colegio.id, 'nombre': colegio.nombre} for colegio in colegios],
            'colegio_id': colegio_id
        }

        # Solo incluir profesor_id si el usuario es profesor
        if profesor_id:
            response.data['profesor_id'] = profesor_id
        
        if alumno_id:
            response.data['alumno_id'] = alumno_id

        return response

# Vista de api usuario, para obtener el token del usuario en sesión
class UserView(APIView):

    # Uso de método get
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Usuario no autenticado...')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expirado...')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Token inválido...')

        return Response({'cookie': token})

class UserUpdateView(APIView): 
    def patch(self, request, usuario_id):
        try:
            user = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        user_data = request.data

        serializer = UserSerializer(user, data=user_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserListView(APIView):

    def get(self, request, usuario_id):
        # Buscar el usuario por ID
        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si el usuario es un alumno
        try:
            alumno = Alumno.objects.get(usuario=usuario)
        except Alumno.DoesNotExist:
            return Response({'error': 'El usuario no es un alumno o no tiene datos asociados como alumno'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener el colegio relacionado con el alumno
        colegio = alumno.colegio
        if not colegio:
            return Response({'error': 'El alumno no está asociado a ningún colegio'}, status=status.HTTP_404_NOT_FOUND)

        # Serializar el colegio
        colegio_serializer = ColegioSerializer(colegio)

        # Serializar el usuario
        usuario_serializer = UserSerializer(usuario)

        # Devolver la respuesta con el colegio y el usuario serializados
        return Response({
            'usuario': usuario_serializer.data,
            'colegio': colegio_serializer.data
        }, status=status.HTTP_200_OK)
    
# Vista de api logout, para cerrar sesión y eliminar el token almacenado en una cookie temporal
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
    
# Vista de api para verificar el token de restablecimiento de contraseña
class VerifyResetTokenView(APIView):

    # Uso de método post
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        
        # Verifica si el UID y el token son obligatorios
        if not uid or not token:
            return Response({'error': 'UID y token son obligatorios'}, status=400)
        
        try:
            # Decodifica el UID y obtiene el ID del usuario
            user_id = urlsafe_base64_decode(uid).decode()
            user = Usuario.objects.get(pk=user_id)

            # Obtiene el token de restablecimiento de contraseña
            password_reset_token = PasswordResetToken.objects.get(token=token)

            # Verifica si el token ha expirado
            if password_reset_token.expired_at is not None and password_reset_token.expired_at < timezone.now():
                return Response({'error': 'El enlace de restablecimiento de contraseña ha expirado.'}, status=400)
            
            # Verifica si el token pertenece al usuario
            if password_reset_token.user != user:
                return Response({'error': 'Token inválido.'}, status=400)
            
            # Verifica si el token ya ha sido utilizado
            if password_reset_token.used:
                return Response({'error': 'Token has already been used.'}, status=400)
            
            # Marca el token como utilizado
            password_reset_token.used = True
            password_reset_token.save()

            # Devuelve una respuesta con el token válido
            return Response({'valid': True})
        
        # Devuelve una respuesta con un error si el token no existe
        except PasswordResetToken.DoesNotExist:
            return Response({'error': 'Token inválido.'}, status=400)
        
        # Devuelve una respuesta con un error si el usuario no existe
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no válido.'}, status=400)
        
        # Devuelve una respuesta con un error si ocurre un error inesperado
        except Exception as e:
            return Response({'error': 'Ocurrió un error al verificar el token.'}, status=500)

# Vista de api cambio de contraseña, recibe el correo del usuario 
# y envía link de para reestablecer contraseña
class ChangePasswordView(APIView):

    # Uso de método post
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Se requiere email...'}, status=400)

        # Se genera el link que contiene un token y uid únicos
        if Usuario.objects.filter(email=email).exists():
            user = Usuario.objects.get(email=email)
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            password_reset_link = f'http://localhost:3000/#/reset-password/{uid}/{token}'

            # Se crea el objeto PasswordResetToken en la base de datos
            PasswordResetToken.objects.create(user=user, token=token)

            # Se crea el cuerpo del email a enviar
            try:
                mail_content = create_mail(
                    email,
                    'Reestablece tu contraseña',
                    'login/reset_password_email.html',
                    {'password_reset_link': password_reset_link}
                )
                mail_content.send(fail_silently=False)
                return Response({'message': 'Link de restablecimiento enviado a tu correo'})
            except Exception as e:
                return Response({'error': 'Error al enviar correo'}, status=500)
        else:
            return Response({'error': 'Correo no encontrado...'}, status=404)

# Vista de api para cambiar la contraseña una vez ingresado al link de reset
class ResetPasswordView(APIView):

    # Uso de método post
    def post(self, request):

        # Parámetros que necesita la api
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uid or not token or not new_password:
            return Response({'error': 'UID, token, and new password son obligatorios'}, status=400)
        
        try:
            validate_password(new_password)
        except ValidationError as e:
            return Response({'error': e.messages}, status=400)

        # Se confirma la validez de token y uid para crear nueva contraseña
        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = Usuario.objects.get(pk=user_id)
            token_generator = PasswordResetTokenGenerator()

            if token_generator.check_token(user, token):
                user.password = make_password(new_password)
                user.save()
                return Response({'message': 'Contraseña actualizada correctamente.'})
            else:
                return Response({'error': 'Token inválido.'}, status=400)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no válido.'}, status=400)
        except Exception as e:
            return Response({'error': 'Ocurrió un error al restablecer la contraseña.'}, status=400)
        
# Nuevas vistas específicas para roles
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'admin':
            return Response({"detail": "Acceso denegado. Solo los administradores pueden acceder a este dashboard."}, status=403)
        
        return Response({"message": "Bienvenido al dashboard de admin"})

class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'student':
            return Response({"detail": "Acceso denegado. Solo los estudiantes pueden acceder a este dashboard."}, status=403)
        return Response({"message": "Bienvenido al dashboard de estudiante"})

class ProfessorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'professor':
            return Response({"detail": "Acceso denegado. Solo los profesores pueden acceder a este dashboard."}, status=403)
        return Response({"message": "Bienvenido al dashboard de profesor"})
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Curso, Colegio, Asignatura, Alumno, Profesor, FechaImportante, Calificacion, Clase
from login.models import Usuario
from .permissions import AdminPermission
from .serializers import *
from django.shortcuts import get_object_or_404
from datetime import datetime

##### VISTAS DE CURSO #####

# Vista para crear un nuevo curso
class CursoCreateView(APIView):

    # permission_classes = [AdminPermission]

    # Método post
    def post(self, request):
        # Obtener los datos del curso desde la solicitud
        curso = request.data.get('curso')
        nivel = request.data.get('nivel')
        cupos = request.data.get('cupos')
        colegio_id = request.data.get('colegio')

        # Verificar si todos los campos obligatorios están presentes
        if not all([curso, nivel, cupos, colegio_id]):
            return Response({'error': 'Faltan campos obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Buscar colegio por ID
        try:
            colegio = Colegio.objects.get(id=colegio_id)
        except Colegio.DoesNotExist:
            return Response({'error': 'Colegio no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Crear los datos del curso con el colegio encontrado
        curso_data = {
            'curso': curso,
            'nivel': nivel,
            'cupos': cupos,
            'colegio': colegio.id
        }

        # Crear un serializador para el curso
        serializer = CursoSerializer(data=curso_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para obtener la lista de cursos por colegio
class CursoListView(APIView):

    # permission_classes = [AdminPermission]

    # Método get
    def get(self, request, colegio_id):
        # Buscar el colegio por ID
        try:
            colegio = Colegio.objects.get(id=colegio_id)
        except Colegio.DoesNotExist:
            return Response({'error': 'Colegio no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los cursos del colegio
        cursos = Curso.objects.filter(colegio=colegio)

        # Crear un serializador para la lista de cursos
        serializer = CursoSerializer(cursos, many=True)

        # Devolver la respuesta con la lista de cursos serializados
        return Response(serializer.data)

# Api para editar cursos
class CursoUpdateView(APIView):

    # permission_classes = [AdminPermission]

    # Método put para actualización completa de un curso
    def put(self, request, curso_id):

        # Buscar el curso por ID
        try:
            curso = Curso.objects.get(id=curso_id)
        except Curso.DoesNotExist:
            return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los datos enviados en la solicitud
        curso_data = request.data

        # Crear un serializador con los datos del curso existente y los nuevos datos
        serializer = CursoSerializer(curso, data=curso_data)

        # Validar y guardar si los datos son válidos
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    # Método patch para actualización parcial
    def patch(self, request, curso_id):

        # Buscar el curso por ID
        try:
            curso = Curso.objects.get(id=curso_id)
        except Curso.DoesNotExist:
            return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los datos enviados en la solicitud
        curso_data = request.data

        # Crear un serializador con los datos del curso existente y los nuevos datos parciales
        serializer = CursoSerializer(curso, data=curso_data, partial=True)

        # Validar y guardar si los datos son válidos
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Api para eliminar curso
class CursoDeleteView(APIView):

    # permission_classes = [AdminPermission]

    def delete(self, request, curso_id):
        # Buscar el curso por ID
        try:
            curso = Curso.objects.get(id=curso_id)
        except Curso.DoesNotExist:
            return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Eliminar curso de la base de datos
        curso.delete()

        # Devolver una respuesta de éxito
        return Response({'message': 'Curso eliminado con éxito'}, status=status.HTTP_204_NO_CONTENT)

# Api para listar todos los profesores de un curso
class CursoListProfesoresView(APIView):
    
    # Permisos para solo administradores

    # permission_classes = [AdminPermission]
    
    def get(self, request, curso_id):
        # Buscar profesores por id de curso
        try:
            curso = Curso.objects.get(id=curso_id)
        except Curso.DoesNotExist:
            return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        profesores = curso.profesores.all()
        
        serializer = ProfesorSerializer(profesores, many=True)
        
        return Response(serializer.data)

##### FIN VISTAS DE CURSO #####

##### VISTAS DE COLEGIO #####

# Api para obtener los colegios en la BDD
class ColegioListView(APIView):
    
    #Comprueba si el usuario que consulta es admin o staff del colegio
    # permission_classes = [AdminPermission]
    
    # Método get para obtener todos los colegios
    def get(self, request, colegio_id=None):
        
        if colegio_id:
            # Si se especifica un colegio_id, obtener datos de un colegio
            try:
                colegio = Colegio.objects.get(id=colegio_id)
            except Colegio.DoesNotExist:
                return Response({'error': 'Colegio no encontrado'}, status=status.HTTP_404_NOT_FOUND)

            serializer = ColegioSerializer(colegio, many=False)
        else:    
            # Obtener todos los colegios
            colegios = Colegio.objects.all()
        
            #Serializador de lista de colegios
            serializer = ColegioSerializer(colegios, many=True)
        
        return  Response(serializer.data)

##### FIN VISTAS DE COLEGIO #####

##### VISTAS DE ASIGNATURA #####

# Api para listar todas las asignaturas creadas en un colegio
class AsignaturaListView(APIView):
    
    # permission_classes = [AdminPermission]

    def get(self, request, colegio_id):
        
        try:
            colegio = Colegio.objects.get(id=colegio_id)
        except Colegio.DoesNotExist:
            return Response({'error': 'Colegio no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Obtener todas las asignaturas
        asignatura = Asignatura.objects.filter(colegio=colegio)
        
        #Serializador de lista de colegios
        serializer = AsignaturaSerializer(asignatura, many=True)
        
        return  Response(serializer.data)

# Api para crear una asignatura en un colegio
class AsignaturaCreateView(APIView):
    
    # permission_classes = [AdminPermission]

    def post(self, request):
        
        asignatura = request.data.get('asignatura')
        descripcion = request.data.get('descripcion')
        colegio_id = request.data.get('colegio')
        cant_notas = request.data.get('cant_notas')
        
        # Verificar si todos los campos obligatorios están presentes
        if not all([asignatura, descripcion, colegio_id]):
            return Response({'error': 'Faltan campos obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        asignatura_data = {
            'asignatura': asignatura,
            'descripcion': descripcion,
            'colegio': colegio_id,
            'cant_notas': cant_notas,
        }

        # Crear un serializador para el curso
        serializer = AsignaturaSerializer(data=asignatura_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Api para actualizar o modificar una asignatura
class AsignaturaUpdateView(APIView):
    
    # permission_classes = [AdminPermission]

    def put(self, request, id_asignatura):

        try:
            asignatura = Asignatura.objects.get(id=id_asignatura)
        except Asignatura.DoesNotExist:
            return Response({'error': 'Asignatura no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los datos enviados en la solicitud
        asignatura_data = request.data

        serializer = AsignaturaSerializer(asignatura, data=asignatura_data)

        # Validar y guardar si los datos son válidos
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Api para eliminar una asignatura
class AsignaturaDeleteView(APIView):
    
    # permission_classes = [AdminPermission]

    def delete(self, request, id_asignatura):
        
        try:
            asignatura = Asignatura.objects.get(id=id_asignatura)
        except Asignatura.DoesNotExist:
            return Response({'error': 'Asignatura no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        asignatura.delete()

        # Devolver una respuesta de éxito
        return Response({'message': 'Asignatura eliminada con éxito'}, status=status.HTTP_204_NO_CONTENT)
    
##### FIN VISTAS DE ASIGNATURA #####

##### INICIO VISTAS DE ALUMNO #####

# Api para registrar datos de alumno
class AlumnoCreateView(APIView):

    # permission_classes = [AdminPermission]

    # Método POST
    def post(self, request):
        # Obtener los datos del alumno desde la solicitud
        rut = request.data.get('rut')
        nombre = request.data.get('nombre')
        apellido_paterno = request.data.get('apellido_paterno')
        apellido_materno = request.data.get('apellido_materno')
        direccion = request.data.get('direccion')
        usuario_id = request.data.get('usuario')
        colegio_id = request.data.get('colegio_id')
        curso_id = request.data.get('curso_id')  # Cambiado a curso_id

        # Verificar si todos los campos obligatorios están presentes
        if not all([rut, nombre, apellido_paterno, apellido_materno, direccion, usuario_id, colegio_id]):
            return Response({'error': 'Faltan campos obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Buscar usuario por ID
        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Buscar colegio por ID
        try:
            colegio = Colegio.objects.get(id=colegio_id)
        except Colegio.DoesNotExist:
            return Response({'error': 'Colegio no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Si el curso está presente, agregarlo a los datos
        alumno_data = {
            'rut': rut,
            'nombre': nombre,
            'apellido_paterno': apellido_paterno,
            'apellido_materno': apellido_materno,
            'direccion': direccion,
            'usuario': usuario.id,
            'colegio_id': colegio.id,
        }

        # Solo agregar curso_id si está presente
        if curso_id:
            alumno_data['curso_id'] = curso_id

        # Crear un serializador para el alumno
        serializer = AlumnoSerializer(data=alumno_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Api para obtener la lista de alumnos por colegio
class AlumnoListView(APIView):

    def get(self, request, colegio_id, curso_id=None):
        # Buscar el colegio por ID
        try:
            colegio = Colegio.objects.get(id=colegio_id)
        except Colegio.DoesNotExist:
            return Response({'error': 'Colegio no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Filtrar los alumnos por colegio
        alumnos = Alumno.objects.filter(colegio=colegio)

        # Si se proporciona un curso_id, filtrar también por curso
        if curso_id is not None:
            try:
                curso = Curso.objects.get(id=curso_id)
                alumnos = alumnos.filter(curso=curso)
            except Curso.DoesNotExist:
                return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Crear un serializador para la lista de alumnos
        serializer = AlumnoSerializer(alumnos, many=True)

        # Devolver la respuesta con la lista de alumnos serializados
        return Response(serializer.data)

# Api para obtener los detalles de un sólo alumno    
class AlumnoDetailView(APIView):
    # permission_classes = [AdminPermission]
    
    # Método GET
    def get(self, request, alumno_id):
        # Buscar al alumno por ID
        try:
            alumno = Alumno.objects.get(id=alumno_id)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AlumnoSerializer(alumno, many=False)
        
        return Response(serializer.data)
    
# Api para editar datos de un alumno
class AlumnoUpdateView(APIView):

    # permission_classes = [AdminPermission]

    # Método put para actualización completa de un alumno
    def put(self, request, alumno_id):

        # Buscar el alumno por ID
        try:
            alumno = Alumno.objects.get(id=alumno_id)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los datos enviados en la solicitud
        alumno_data = request.data

        # Crear un serializador con los datos del alumno existente y los nuevos datos
        serializer = AlumnoSerializer(alumno, data=alumno_data)

        # Validar y guardar si los datos son válidos
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Método PATCH para actualización parcial de un alumno
    def patch(self, request, alumno_id):
        # Buscar el alumno por ID
        try:
            alumno = Alumno.objects.get(id=alumno_id)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los datos enviados en la solicitud
        alumno_data = request.data

        # Crear un serializador con los datos del alumno existente y los nuevos datos (parciales)
        serializer = AlumnoSerializer(alumno, data=alumno_data, partial=True)

        # Validar y guardar si los datos son válidos
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			

##### FIN VISTAS DE ALUMNO #####

##### VISTAS DE PROFESOR #####

# Api para registrar un profesor en un colegio
class ProfesorCreateView(APIView):
    
    def post(self, request):
        # Obtener los datos enviados en la solicitud
        rut = request.data.get('rut')
        nombre = request.data.get('nombre')
        apellido_paterno = request.data.get('apellido_paterno')
        apellido_materno = request.data.get('apellido_materno')
        contacto = request.data.get('contacto')
        usuario_id = request.data.get('usuario')
        colegios_ids = request.data.get('colegio_ids')
        cursos_ids = request.data.get(' curso_ids')
        asignaturas_ids = request.data.get('asignatura_ids')

        # Validar que los campos requeridos estén presentes
        if not all([rut, nombre, apellido_paterno, apellido_materno, contacto, usuario_id, colegios_ids]):
            return Response({'error': 'Faltan campos obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que el usuario existe
        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que todos los colegios existen
        colegios = Colegio.objects.filter(id__in=colegios_ids)
        if colegios.count() != len(colegios_ids):
            return Response({'error': 'Uno o más colegios no fueron encontrados'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que los cursos existen (si se enviaron)
        if cursos_ids:
            cursos = Curso.objects.filter(id__in=cursos_ids)
            if cursos.count() != len(cursos_ids):
                return Response({'error': 'Uno o más cursos no fueron encontrados'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            cursos = []

        # Validar que las asignaturas existen (si se enviaron)
        if asignaturas_ids:
            asignaturas = Asignatura.objects.filter(id__in=asignaturas_ids)
            if asignaturas.count() != len(asignaturas_ids):
                return Response({'error': 'Una o más asignaturas no fueron encontradas'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            asignaturas = []

        # Datos para crear el profesor
        profesor_data = {
            'rut': rut,
            'nombre': nombre,
            'apellido_paterno': apellido_paterno,
            'apellido_materno': apellido_materno,
            'contacto': contacto,
            'usuario': usuario.id,
            'colegio_ids': colegios_ids,
            'curso_ids': cursos_ids if cursos_ids else [], 
            'asignatura_ids': asignaturas_ids if asignaturas_ids else []
        }

        # Serializar los datos
        serializer = ProfesorSerializer(data=profesor_data)
        if serializer.is_valid():
            profesor = serializer.save()

            return Response(ProfesorSerializer(profesor).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Api para listar todos los profesores o sólo un profesor de un colegio
class ProfesorListView(APIView):
    
    # permission_classes = [AdminPermission]
    
    def get(self, request, colegio_id, profesor_id=None):
        # Buscar el colegio por ID
        try:
            colegio = Colegio.objects.get(id=colegio_id)
        except Colegio.DoesNotExist:
            return Response({'error': 'Colegio no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Si se proporciona profesor_id, buscar el profesor específico en el colegio
        if profesor_id:
            try:
                profesor = colegio.profesores.get(id=profesor_id)
                serializer = ProfesorSerializer(profesor)
                return Response(serializer.data)
            except Profesor.DoesNotExist:
                return Response({'error': 'Profesor no encontrado en el colegio'}, status=status.HTTP_404_NOT_FOUND)
        
        # Si no se proporciona profesor_id, obtener todos los profesores del colegio
        profesores = colegio.profesores.all()
        
        # Crear un serializador para la lista de profesores
        serializer = ProfesorSerializer(profesores, many=True)

        # Devolver la respuesta con la lista de profesores serializados
        return Response(serializer.data)

# Api para actualizar o modificar datos de un profesor
class ProfesorUpdateView(APIView):
    
    # permission_classes = [AdminPermission]
    
    # Método put para actualización de datos de un profesor
    def put(self, request, profesor_id):

        # Buscar el profesor por ID
        try:
            profesor = Profesor.objects.get(id=profesor_id)
        except Profesor.DoesNotExist:
            return Response({'error': 'Profesor no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los datos enviados en la solicitud
        profesor_data = request.data

        # Crear un serializador con los datos del profesor existentes y los nuevos datos
        serializer = ProfesorSerializer(profesor, data=profesor_data)
        
        # Validar y guardar si los datos son válidos
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
     # Método PATCH para actualización parcial de un profesor
    def patch(self, request, profesor_id):
        
        # Buscar el profesor por ID
        try:
            profesor = Profesor.objects.get(id=profesor_id)
        except Profesor.DoesNotExist:
            return Response({'error': 'Profesor no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los datos enviados en la solicitud
        profesor_data = request.data

         # Crear un serializador con los datos del profesor existentes y los nuevos datos
        serializer = ProfesorSerializer(profesor, data=profesor_data, partial=True)

        # Validar y guardar si los datos son válidos
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Api para eliminar un profesor de un colegio
class ProfesorDeleteColegioView(APIView):
    
    # permission_classes = [AdminPermission]
    
    # Método para eliminar la relación ManyToMany entre profesor y colegio.
    def delete(self, request, profesor_id, colegio_id):
        # Buscar el profesor por ID
        try:
            profesor = Profesor.objects.get(id=profesor_id)
        except Profesor.DoesNotExist:
            return Response({'error':'Profesor no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Buscar el colegio por ID
        try:
            colegio = Colegio.objects.get(id=colegio_id)
        except Colegio.DoesNotExist:
            return Response({'error':'Colegio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        listaCursos = profesor.cursos.get(colegio=colegio)
        
        colegio.profesores.remove(profesor.id)
        profesor.cursos.remove(listaCursos)
        
        # Devolver una respuesta de éxito
        return Response({'message': 'Colegio eliminado de profesor con éxito'}, status=status.HTTP_204_NO_CONTENT)

##### FIN VISTAS DE PROFESOR #####

##### VISTAS DE FECHAIMPORTANTE #####

# Api para listar fechas importantes de un curso y asignatura
class FechaImportanteListView(APIView):
    # permission_classes = [AdminPermission]
    
    def get(self, request, curso_id, asignatura_id=None):
        
        try:
            curso = Curso.objects.get(id=curso_id)
        except Curso.DoesNotExist:
            return Response({'error':'Curso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        if asignatura_id:    
            try:
                asignatura = Asignatura.objects.get(id=asignatura_id)
                
                evento = FechaImportante.objects.filter(curso=curso, asignatura=asignatura)        
                serializer = FechaImportanteSerializer(evento, many=True)
                
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Asignatura.DoesNotExist:
                return Response({'error':'Asignatura no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        
        fechas = FechaImportante.objects.filter(curso=curso)
        serializer = FechaImportanteSerializer(fechas, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class FechaImportanteCreateView(APIView):
    # permission_classes = [AdminPermission]
    
    def post(self, request):
        # Obtener los datos enviados en la solicitud
        
        curso_id = request.data.get('curso')
        asignatura_id = request.data.get('asignatura_id')
        
        try:
            curso = Curso.objects.get(id=curso_id)
            asignatura = Asignatura.objects.get(id=asignatura_id)
        except Curso.DoesNotExist:
            return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Asignatura.DoesNotExist:
            return Response({'error': 'Asignatura no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        fecha_data = {
            'curso': curso_id,
            'asignatura': asignatura.id,
            'fecha': request.data.get('fecha'),
            'evento': request.data.get('evento'),
        }
        serializer = FechaImportanteSerializer(data=fecha_data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FechaImportanteUpdateView(APIView):
    
    def put(self, request, fecha_id):
        
        curso_id = request.data.get('curso')
        
        try:
            curso = Curso.objects.get(id=curso_id)
            fecha_importante = FechaImportante.objects.get(id=fecha_id)
            
        except FechaImportante.DoesNotExist:
            return Response({'error': 'Fecha Importante no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Curso.DoesNotExist:
            return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        fecha_data = request.data
        serializer = FechaImportanteSerializer(fecha_importante, data=fecha_data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, fecha_id):
        
        curso_id = request.data.get('curso')
        
        try:
            curso = Curso.objects.get(id=curso_id)
            fecha_importante = FechaImportante.objects.get(id=fecha_id)
            
        except FechaImportante.DoesNotExist:
            return Response({'error': 'Fecha Importante no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Curso.DoesNotExist:
            return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        fecha_data = request.data
        serializer = FechaImportanteSerializer(fecha_importante, data=fecha_data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class FechaImportanteDeleteView(APIView):
    
    def delete(self, request, fecha_id):
        
        try:
            fecha_importante = FechaImportante.objects.get(id=fecha_id)
        except FechaImportante.DoesNotExist:
            return Response({'error': 'Fecha Importante no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        fecha_importante.delete()
        
        return Response({'message': 'Fecha importante eliminada con éxito'}, status=status.HTTP_204_NO_CONTENT)
        
##### FIN VISTAS DE FECHAIMPORTANTE ##### 

##### VISTAS DE CLASE #####

class ClaseCreateView(APIView):

    def post(self, request):
        # Extraer datos del request
        comentario = request.data.get('comentario')
        activa = request.data.get('activa')
        hora_inicio = request.data.get('hora_inicio')
        hora_termino = request.data.get('hora_termino')
        profesor_id = request.data.get('profesor_id')
        asignatura_id = request.data.get('asignatura_id')
        curso_id = request.data.get('curso_id')
        alumno_ids = request.data.get('alumno_ids')
        
        # Verificar que no falten campos obligatorios
        if not all([comentario, activa, hora_inicio, 
                    hora_termino, profesor_id, asignatura_id, 
                    curso_id]):
            return Response({'error': 'Faltan campos obligatorios'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Validar que las asignaturas existen (si se enviaron)
        if alumno_ids:
            alumnos = Alumno.objects.filter(id__in=alumno_ids)
            if alumnos.count() != len(alumno_ids):
                return Response({'error': 'Uno o más alumnos no fueron encontrados'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            alumnos = []

        # Validar que las referencias a otros modelos existen
        get_object_or_404(Profesor, id=profesor_id)
        get_object_or_404(Asignatura, id=asignatura_id)
        get_object_or_404(Curso, id=curso_id)
        for alumno_id in alumno_ids:
            get_object_or_404(Alumno, id=alumno_id)

        # Construir datos de la clase
        clase_data = {
            'comentario': comentario,
            'activa': activa,
            'hora_inicio': hora_inicio,
            'hora_termino': hora_termino,
            'profesor_id': profesor_id,
            'asignatura_id': asignatura_id,
            'curso_id': curso_id,
            'alumno_ids': alumno_ids if alumno_ids else []
        }

        # Validar y guardar usando el serializer
        serializer = ClaseSerializer(data=clase_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClaseUpdateView(APIView):
    
    def put(self, request, clase_id):
        try:
            clase = Clase.objects.get(id=clase_id)
        except Clase.DoesNotExist:
            return Response({'error': 'Clase no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        clase_data = request.data

        serializer = ClaseSerializer(clase, data=clase_data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self, request, clase_id):
        try:
            clase = Clase.objects.get(id=clase_id)
        except Clase.DoesNotExist:
            return Response({'error': 'Clase no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        clase_data = request.data

        serializer = ClaseSerializer(clase, data=clase_data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ClaseListView(APIView):
    
    # Esta vista es necesaria para listar clases de un profesor por curso y asignatura
    def get(self, request, curso_id, asignatura_id):
        
        # Se buscan el curso y asignatura de las clases a mostrar
        try:
            curso = Curso.objects.get(id=curso_id)
            asignatura = Asignatura.objects.get(id=asignatura_id)
        except (Curso.DoesNotExist):
            # Si no existe el curso, mostrar un error
            return Response({'error': 'Curso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except (Asignatura.DoesNotExist):
            # Si no existe la asignatura, mostrar un error
            return Response({'error': 'Asignatura no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        clases = Clase.objects.filter(curso=curso, asignatura=asignatura)
        
        serializer = ClaseSerializer(clases, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

##### FIN VISTAS DE CLASE ##### 

##### VISTAS DE ASISTENCIA #####

class AsistenciaCreateView(APIView):

    def post(self, request, clase_id):
        # Extraer la lista de asistencias desde el request
        asistencias_data = request.data.get('asistencias', [])
        
        if not asistencias_data:
            return Response({'error': 'No se proporcionaron datos de asistencia'}, status=status.HTTP_400_BAD_REQUEST)
        
        errores = []
        asistencias_creadas = []

        # Procesar cada asistencia individualmente
        for asistencia_data in asistencias_data:
            asistencia_data['clase_id'] = clase_id
            serializer = AsistenciaSerializer(data=asistencia_data)
            if serializer.is_valid():
                serializer.save()
                asistencias_creadas.append(serializer.data)
            else:
                errores.append(serializer.errors)

        # Devolver resultados
        if errores:
            return Response(
                {'asistencias_creadas': asistencias_creadas, 'errores': errores},
                status=status.HTTP_207_MULTI_STATUS
            )
        
        return Response({'asistencias_creadas': asistencias_creadas}, status=status.HTTP_201_CREATED)

class AsistenciaDetailView(APIView):
    
    def get(self, request, alumno_id):
        
        try:
            alumno = Alumno.objects.get(id=alumno_id)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Clases totales registradas del curso
        curso_id = alumno.curso
        clases_totales = Clase.objects.filter(curso=curso_id).count()
        
        #Clases asistidas por el alumno
        asistencias = Asistencia.objects.filter(alumno=alumno, presente=True)
        clases_asistidas = asistencias.count()
        
        serializer = AsistenciaSerializer(asistencias, many=True)
        
        return Response({
            'asistencias': serializer.data,
            'clases_totales': clases_totales,
            'clases_asistidas': clases_asistidas
        })

class AsistenciaListProfesorView(APIView):
    
    def get(self, request, clase_id):
        
        try:
            clase = Clase.objects.get(id=clase_id)
        except Clase.DoesNotExist:
            return Response({'error': 'Clase no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Se obtienen todos los alumnos de la clase
        alumnos = Alumno.objects.filter(curso=clase.curso)
        
        # Se obtienen datos de asistencia para cada alumno
        asistencias = []
        for alumno in alumnos:
            alumno_asistencia = Asistencia.objects.filter(alumno=alumno, clase=clase)
            asistencias.extend(alumno_asistencia)
        
        # Ordenar datos en el serializer y enviarlos
        serializer = AsistenciaSerializer(asistencias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AsistenciaListAdminView(APIView):
    
    def get(self, request, colegio_id, fecha):
        
        # Se busca el colegio de los cursos a mostrar
        try:
            colegio = Colegio.objects.get(id=colegio_id)
            cursos = Curso.objects.filter(colegio=colegio)
        except Colegio.DoesNotExist:
            # Si no existe el colegio, mostrar un error
            return Response({'error': 'Colegio no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Curso.DoesNotExist:
            # Si no existen cursos, mostrar un error
            return Response({'error': 'No existen cursos en el colegio'}, status=status.HTTP_204_NO_CONTENT)
        
        # Esta función le da formato a la fecha de la variable
        fecha_hoy = datetime.today().strftime('%m-%Y')
        
        # Se comprueba que la fecha ingresada a la vista no sea posterior a las fechas de asistencia registradas
        if fecha > fecha_hoy:
            return Response({'error': 'Fecha no válida'}, status=status.HTTP_400_BAD_REQUEST)
        
        resultados = []
        
        mes = int(fecha[0:2])
        anio = int(fecha[3:])
        
        peor_asistencia = float('inf')
        cursos_peor_asistencia = []
        peor_total_asistencias = None
        peor_total_clases = None
        
        # Para todos los cursos en el colegio
        for curso in cursos:
            # Se buscan clases del curso entre fecha_inicio y fecha_fin
            clases = Clase.objects.filter(
                curso=curso,
                fecha__year=anio,
                fecha__month=mes
            )
            
            # Si no encuentra clases, deja el promedio de asistencias en cero
            if not clases.exists():
                resultados.append({
                    'curso': curso.curso, 
                    'promedio_asistencias': 0, 
                    'total_asistencias': "No hay clases registradas.",
                    'total_clases': "No hay clases registradas.",
                })
                continue
            
            total_asistencias = 0
            total_clases = 0
            total_alumnos = 0
            
            for clase in clases:
                asistencias = Asistencia.objects.filter(clase=clase)
                
                if (asistencias.count() > 0):
                    total_asistencias += asistencias.filter(presente=True).count()
                    total_alumnos += asistencias.count()
                    total_clases += 1
                else:
                    resultados.append({
                        'curso': curso.curso,
                        'promedio_asistencias': 0,
                        'total_asistencias': "No hay asistencias.",
                        'total_clases': "No hay asistencias.",
                    })
                    continue
            
            if total_alumnos > 0:
                # Aquí se calcula el promedio de asistencias
                promedio_asistencias = (total_asistencias / total_alumnos)
            else:
                promedio_asistencias = 0
                continue
            
            
            if promedio_asistencias == 0:
                resultados.append({
                    'curso': curso.curso,
                    'promedio_asistencias': 0,
                    'total_asistencias': "No hay asistencias.",
                    'total_clases': "No hay asistencias.",
                })
                
                if peor_asistencia > 0:
                    peor_asistencia = 0
                    cursos_peor_asistencia[curso.curso]
                    peor_total_asistencias = 0
                    peor_total_clases = 0

                elif peor_asistencia == 0:
                    cursos_peor_asistencia.append(curso.curso)
                
            else:
                resultados.append({
                    'curso': curso.curso,
                    'promedio_asistencias': promedio_asistencias,
                    'total_asistencias': total_asistencias,
                    'total_clases': total_clases
                })
                
                if promedio_asistencias < peor_asistencia:
                    peor_asistencia = promedio_asistencias
                    cursos_peor_asistencia = [curso.curso]
                    peor_total_asistencias = total_asistencias
                    peor_total_clases = total_clases

                elif promedio_asistencias == peor_asistencia:
                    cursos_peor_asistencia.append(curso.curso)
        
        if cursos_peor_asistencia:
            resultados.append({
                'cursos_peor_asistencia': cursos_peor_asistencia,
                'promedio_peor_asistencia': peor_asistencia,
                'peor_total_asistencias': peor_total_asistencias,
                'peor_total_clases': peor_total_clases,

            })
            
        return Response(resultados, status=status.HTTP_200_OK)
    
class AsistenciaUpdateView(APIView):
    def patch(self, request, asistencia_id):
        try:
            asistencia = Asistencia.objects.get(id=asistencia_id)
        except Asistencia.DoesNotExist:
            return Response({'error': 'Asistencia no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        asistencia_data = request.data

        serializer = AsistenciaSerializer(asistencia, data=asistencia_data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

##### FIN VISTAS DE ASISTENCIA #####

##### VISTAS DE CALIFICACIONES #####

class CalificacionesCreateView(APIView):
     def post(self, request, asignatura_id):
        calificaciones_data = request.data.get('calificaciones', [])

        if not calificaciones_data:
            return Response({'error': 'No se proporcionaron datos de calificaciones'}, status=status.HTTP_400_BAD_REQUEST)
        
        errores = []
        calificaciones_creadas = []

        for calificacion_data in calificaciones_data:
            calificacion_data['asignatura_id'] = asignatura_id
            serializer = CalificacionSerializer(data=calificacion_data)
            if serializer.is_valid():
                serializer.save()
                calificaciones_creadas.append(serializer.data)
            else:
                errores.append(serializer.errors)

        if errores:
            return Response(
                {'calificaciones_creadas': calificaciones_creadas, 'errores': errores},
                status=status.HTTP_207_MULTI_STATUS
            )
        
        return Response({'calificaciones_creadas': calificaciones_creadas}, status=status.HTTP_201_CREATED)

class CalificacionesListView(APIView):
    
    def get(self, request, alumno_id, asignatura_id=None):
        # Verificar alumno_id y asignatura_id
        try:
            alumno = Alumno.objects.get(id=alumno_id)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        if asignatura_id:
            try:
                asignatura = Asignatura.objects.get(id=asignatura_id)
            except Asignatura.DoesNotExist:
                return Response({'error': 'Asignatura no encontrada'}, status=status.HTTP_404_NOT_FOUND)
            
            notas = Calificacion.objects.filter(alumno=alumno, asignatura=asignatura)
            serializer = CalificacionSerializer(notas, many=True)
            
            return Response(serializer.data)
        else:
            notas = Calificacion.objects.filter(alumno=alumno)
            serializer = CalificacionSerializer(notas, many=True)
            
            return Response(serializer.data)

class CalificacionesUpdateView(APIView):
    def put(self, request):
        data = request.data
        if not isinstance(data, list):
            return Response(
                {'error': 'Se espera una lista de objetos de calificaciones'},
                status=status.HTTP_400_BAD_REQUEST
            )

        response_data = []
        for calificacion_data in data:
            calificacion_id = calificacion_data.get('id')
            if not calificacion_id:
                response_data.append({'error': 'Falta el ID de la calificación'})
                continue

            try:
                calificacion = Calificacion.objects.get(id=calificacion_id)
            except Calificacion.DoesNotExist:
                response_data.append({'id': calificacion_id, 'error': 'Calificación no encontrada'})
                continue

            serializer = CalificacionSerializer(calificacion, data=calificacion_data)
            if serializer.is_valid():
                serializer.save()
                response_data.append({'id': calificacion_id, 'success': True, 'data': serializer.data})
            else:
                response_data.append({'id': calificacion_id, 'success': False, 'errors': serializer.errors})

        return Response(response_data, status=status.HTTP_200_OK)

    def patch(self, request):
        data = request.data
        if not isinstance(data, list):
            return Response(
                {'error': 'Se espera una lista de objetos de calificaciones'},
                status=status.HTTP_400_BAD_REQUEST
            )

        response_data = []
        for calificacion_data in data:
            calificacion_id = calificacion_data.get('id')
            if not calificacion_id:
                response_data.append({'error': 'Falta el ID de la calificación'})
                continue

            try:
                calificacion = Calificacion.objects.get(id=calificacion_id)
            except Calificacion.DoesNotExist:
                response_data.append({'id': calificacion_id, 'error': 'Calificación no encontrada'})
                continue

            serializer = CalificacionSerializer(calificacion, data=calificacion_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response_data.append({'id': calificacion_id, 'success': True, 'data': serializer.data})
            else:
                response_data.append({'id': calificacion_id, 'success': False, 'errors': serializer.errors})

        return Response(response_data, status=status.HTTP_200_OK)

class CalificacionesDeleteView(APIView):
    pass

##### FIN VISTAS DE CALIFICACIONES #####
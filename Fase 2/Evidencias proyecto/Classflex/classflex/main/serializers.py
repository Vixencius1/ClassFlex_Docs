from rest_framework import serializers
from datetime import datetime, date
from django.core.exceptions import ValidationError
from .models import *

# Clase de serializador para el modelo Colegio
class ColegioSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Colegio
        fields = ['id', 'nombre', 'direccion', 'ciudad', 'region', 'contacto', 'email']

# Clase de serializador para el modelo Asignatura
class AsignaturaSerializer(serializers.ModelSerializer):
    
    # Define un campo para el colegio, es un campo relacionado con Curso
    colegio = serializers.PrimaryKeyRelatedField(queryset=Colegio.objects.all(), required=True)
    
    class Meta:
        model = Asignatura
        fields = ['id', 'asignatura', 'descripcion', 'fecha_creacion', 'fecha_modificacion', 'colegio', 'cant_notas']
    
    def create(self, validated_data):
        length = len(validated_data.get('asignatura'))
        
        if length == 0:
            raise ValidationError({'asignatura': 'El campo asignatura no puede estar vacío.'})

        asignatura = Asignatura.objects.create(**validated_data)
        return asignatura

class CursoSerializer(serializers.ModelSerializer):

    # Define un campo para el colegio, es un campo relacionado con Curso
    colegio = serializers.PrimaryKeyRelatedField(queryset=Colegio.objects.all(), required=True)
    profesor = serializers.PrimaryKeyRelatedField(queryset=Profesor.objects.all(), required=False, allow_null=False, write_only=True)
    asignaturas = AsignaturaSerializer(many=True, read_only=True)

    asignatura_ids = serializers.PrimaryKeyRelatedField(queryset=Asignatura.objects.all(), many=True, required=False, write_only=True)

    class Meta:
        model = Curso
        fields = ['id', 'curso', 'nivel', 'cupos',
                  'colegio', 'profesor', 'asignatura_ids', 'asignaturas']

    # Método create personalizado para hacer validaciones
    def create(self, validated_data):
        # Extraer asignatura_ids del validated_data
        asignatura_ids = validated_data.pop('asignatura_ids', [])

        # Verificar si el campo colegio está presente
        colegio = validated_data.get('colegio')
        if not colegio:
            raise ValidationError({'colegio': 'Este campo es requerido'})

        # Crear y devolver una nueva instancia de Curso
        curso = Curso.objects.create(**validated_data)

        # Asociar las asignaturas al curso
        if asignatura_ids:
            curso.asignaturas.set(asignatura_ids)

        return curso

    # Método update personalizado para actualizar el curso
    def update(self, instance, validated_data):
        # Extraer asignatura_ids del validated_data
        asignatura_ids = validated_data.pop('asignatura_ids', None)

        # Actualizar los campos del curso con los datos validados
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar las asignaturas si se proporcionaron
        if asignatura_ids is not None:
            instance.asignaturas.set(asignatura_ids)

        return instance

class AlumnoSerializer(serializers.ModelSerializer):
    correo = serializers.CharField(source='usuario.email', read_only=True)
    is_active = serializers.CharField(source='usuario.is_active', read_only=True)

    colegio = ColegioSerializer(read_only=True)
    colegio_id = serializers.PrimaryKeyRelatedField(source='colegio', queryset=Colegio.objects.all(), required=True)
    curso = CursoSerializer(read_only=True)
    curso_id = serializers.PrimaryKeyRelatedField(source='curso', queryset=Curso.objects.all(), required=False)

    class Meta:
        model = Alumno
        fields = ['id', 'rut', 'nombre', 'apellido_paterno', 'apellido_materno', 
                  'direccion', 'usuario', 'colegio', 'colegio_id', 'curso',
                  'curso_id', 'correo', 'is_active']
        # Anteriormente se utilizó 'nombre_curso' aquí

    # Método create personalizado para hacer validaciones
    def create(self, validated_data):
        # Verificar si el campo usuario está presente
        usuario = validated_data.get('usuario')
        if not usuario:
            raise ValidationError({'usuario': 'Este campo es requerido'})

        # Verificar si el campo colegio está presente
        colegio_id = validated_data.get('colegio')
        if not colegio_id:
            raise ValidationError(message={'colegio': 'Este campo es requerido'})

        curso_id = validated_data.pop('curso_id', None)
        if curso_id:
            validated_data['curso'] = Curso.objects.get(id=curso_id)

        # Crear y devolver una nueva instancia de Alumno
        alumno = Alumno.objects.create(**validated_data)
        return alumno

# Clase de serializador para el modelo Profesor
class ProfesorSerializer(serializers.ModelSerializer):
    correo = serializers.CharField(source='usuario.email', read_only=True)
    is_active = serializers.CharField(source='usuario.is_active', read_only=True)

    colegios = ColegioSerializer(many=True, read_only=True)
    cursos = CursoSerializer(many=True, read_only=True)
    asignaturas = AsignaturaSerializer(many=True, read_only=True)
    
    colegio_ids = serializers.PrimaryKeyRelatedField(queryset=Colegio.objects.all(), many=True, write_only=True)
    curso_ids = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all(), many=True, required=False, write_only=True)
    asignatura_ids = serializers.PrimaryKeyRelatedField(queryset=Asignatura.objects.all(), many=True, required=False, write_only=True)
    
    class Meta:
        model = Profesor
        fields = ['id', 'rut', 'nombre', 'apellido_paterno', 'apellido_materno', 
                  'contacto', 'usuario', 'colegios', 'cursos', 'asignaturas', 
                  'colegio_ids', 'curso_ids', 'asignatura_ids', 'is_active','correo']
    
    def create(self, validated_data):
        colegio_ids = validated_data.pop('colegio_ids', [])
        curso_ids = validated_data.pop('curso_ids', [])
        asignatura_ids = validated_data.pop('asignatura_ids', [])
        
        profesor = Profesor.objects.create(**validated_data)
        profesor.colegios.set(colegio_ids)
        profesor.cursos.set(curso_ids)
        profesor.asignaturas.set(asignatura_ids)
        
        return profesor

    def update(self, instance, validated_data):
        colegio_ids = validated_data.pop('colegio_ids', None)
        curso_ids = validated_data.pop('curso_ids', None)
        asignatura_ids = validated_data.pop('asignatura_ids', None)
        
        # Actualizar los campos del Profesor
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Actualizar las relaciones
        if colegio_ids is not None:
            instance.colegios.set(colegio_ids)
        if curso_ids is not None:
            instance.cursos.set(curso_ids)
        if asignatura_ids is not None:
            instance.asignaturas.set(asignatura_ids)
        
        return instance
    
# Clase de serializador para el modelo Clase
class ClaseSerializer(serializers.ModelSerializer):
    profesor_id = serializers.PrimaryKeyRelatedField(queryset=Profesor.objects.all(), source='profesor', required=True)
    asignatura_id = serializers.PrimaryKeyRelatedField(queryset=Asignatura.objects.all(), source='asignatura', required=True)
    curso_id = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all(), source='curso', required=False)
    alumno_ids = serializers.PrimaryKeyRelatedField(queryset=Alumno.objects.all(), many=True, required=False, source='alumnos')

    class Meta:
        model = Clase
        fields = ['id', 'comentario', 'activa','fecha', 'hora_inicio', 'hora_termino',
                  'profesor_id', 'asignatura_id', 'curso_id', 'alumno_ids']
        
    def create(self, validated_data):
        alumno_ids = validated_data.pop('alumnos', None)

        clase = Clase.objects.create(**validated_data)
        if alumno_ids:
            clase.alumnos.set(alumno_ids)

        return clase

    def update(self, instance, validated_data):
        alumno_ids = validated_data.pop('alumnos', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if alumno_ids is not None:
            instance.alumnos.set(alumno_ids)

        return instance

# Clase de serializador para el modelo Asistencia
class AsistenciaSerializer(serializers.ModelSerializer):
    alumno_id = serializers.PrimaryKeyRelatedField(queryset=Alumno.objects.all(), source='alumno', required=True)
    clase_id = serializers.PrimaryKeyRelatedField(queryset=Clase.objects.all(), source='clase', required=True)

    class Meta:
        model = Asistencia
        fields = ['id', 'alumno_id', 'clase_id', 'fecha', 'presente', 'justificado']
        read_only_fields = ['fecha']

    def create(self, validated_data):
        return Asistencia.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.presente = validated_data.get('presente', instance.presente)
        instance.justificado = validated_data.get('justificado', instance.justificado)
        instance.save()
        return instance

class FechaImportanteSerializer(serializers.ModelSerializer):
    
    # Las fechas registradas deben contener un curso asociado registrado
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all(), required=True)
    asignatura = serializers.PrimaryKeyRelatedField(queryset=Asignatura.objects.all(), required=True)
    asignaturaObj = AsignaturaSerializer(read_only=True)
    
    class Meta:
        model = FechaImportante
        fields = ['id', 'curso', 'evento', 'fecha', 'asignatura', 'asignaturaObj']
    
    def create(self, validated_data):
        evento = validated_data.get('evento')
        fecha = datetime.combine(validated_data.get('fecha'), datetime.min.time())
        fecha_actual = datetime.combine(date.today(), datetime.min.time())
        
        if len(evento) < 1:
            raise serializers.ValidationError({'evento': 'El evento debe tener al menos un caracter.'})
        
        if fecha < fecha_actual:
            raise serializers.ValidationError({'fecha': 'La fecha no puede ser anterior a la de hoy.'})
        
        fecha_importante = FechaImportante.objects.create(**validated_data)
        return fecha_importante
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['asignaturaObj'] = AsignaturaSerializer(instance.asignatura).data
        return representation

class CalificacionSerializer(serializers.ModelSerializer):
    alumno = serializers.PrimaryKeyRelatedField(queryset=Alumno.objects.all(), required=True)
    asignatura = serializers.PrimaryKeyRelatedField(queryset=Asignatura.objects.all(), required=True)
    
    class Meta:
        model = Calificacion
        fields = ['id', 'alumno', 'asignatura', 'nota', 'tipo_evaluacion', 'fecha']
        read_only_fields = ['fecha']

    def create(self, validated_data):
        return Calificacion.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.nota = validated_data.get('nota', instance.nota)
        instance.save()
        return instance
    
from django.contrib import admin
from .models import *

# Aquí se agregan modelos para visualizar en sitio admin de Django

class ColegioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'id','direccion', 'ciudad', 'region', 'contacto', 'email']
    readonly_fields =  ['id']

class CursoAdmin(admin.ModelAdmin):
    list_display = ['curso', 'nivel', 'cupos', 'colegio', 'id']

class AsignaturaAdmin(admin.ModelAdmin):
    list_display = ['asignatura', 'descripcion', 'cant_notas','fecha_creacion', 'fecha_modificacion']
    readonly_fields = ['fecha_creacion', 'fecha_modificacion']
    
    # Separación de columnas por grupos
    fieldsets = (
        (None, {'fields': ('asignatura', 'descripcion', 'cant_notas')}),
        ('Fechas Importantes', {'fields': ('fecha_creacion', 'fecha_modificacion')}),
    )

class AlumnoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'apellido_paterno', 'rut', 'colegio']
    readonly_fields = ['foto']

class ProfesorAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apellido_paterno', 'rut', 'colegios', 'usuario']

    def colegios(self, obj):
        return ', '.join([colegio.nombre for colegio in obj.colegios.all()])
    colegios.short_description = 'Colegios'

class AdministradorAdmin(admin.ModelAdmin):
    list_display = ['usuario','nombre', 'apellido_paterno', 'colegio']

class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ['departamento']

class SemestreAdmin(admin.ModelAdmin):
    list_display = ['semestre', 'annio']

class ClaseAdmin(admin.ModelAdmin):
    list_display = ['id','curso', 'comentario','fecha', 
                    'hora_inicio','hora_termino', 'activa']

class AsistenciaAdmin(admin.ModelAdmin):
    list_display = ['id', 'alumno', 'fecha', 'presente']

class CalificacionAdmin(admin.ModelAdmin):
    list_display = ['alumno', 'asignatura', 'nota', 
                    'tipo_evaluacion', 'fecha']

class FechasImportantesAdmin(admin.ModelAdmin):
    list_display = ['evento', 'fecha', 'curso']


admin.site.register(Colegio, ColegioAdmin)
admin.site.register(Curso, CursoAdmin)
admin.site.register(Asignatura, AsignaturaAdmin)
admin.site.register(Alumno, AlumnoAdmin)
admin.site.register(Profesor, ProfesorAdmin)
admin.site.register(Administrador, AdministradorAdmin)
admin.site.register(Departamento, DepartamentoAdmin)
admin.site.register(Semestre, SemestreAdmin)
admin.site.register(Clase, ClaseAdmin)
admin.site.register(Asistencia, AsistenciaAdmin)
admin.site.register(Calificacion, CalificacionAdmin)
admin.site.register(FechaImportante, FechasImportantesAdmin)


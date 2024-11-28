from django.urls import path
from .views import *

urlpatterns = [
    # URLS Usuario
    # path('listar-alumnos', AlumnoListView.as_view(), name='listar-alumnos'),
    
    # URLS Asignatura
    path('crear-asignatura', AsignaturaCreateView.as_view(), name='crear-asignatura'),
    path('asignatura/<int:colegio_id>/listar-asignatura', AsignaturaListView.as_view(), name='listar-asignaturas'),
    path('asignatura/<int:id_asignatura>/update', AsignaturaUpdateView.as_view(), name='asignatura-update'),
    path('asignatura/<int:id_asignatura>/delete', AsignaturaDeleteView.as_view(), name='asignatura-delete'),
    
    # URLS Colegio
    path('listar-colegios', ColegioListView.as_view(), name='listar-colegios'),
    path('listar-colegios/<int:colegio_id>', ColegioListView.as_view(), name='listar-colegio-id'),
    
    # URL Curso
    path('crear-curso', CursoCreateView.as_view(), name='crear-curso'),
    path('curso/<int:colegio_id>/listar-curso', CursoListView.as_view(), name='listar-curso'),
    path('curso/<int:curso_id>/listar-curso-profesores', CursoListProfesoresView.as_view(), name='listar-curso-profesores'),
    path('curso/<int:curso_id>/update', CursoUpdateView.as_view(), name='curso-update'),
    path('curso/<int:curso_id>/delete', CursoDeleteView.as_view(), name='curso-delete'),

    # URL Alumno
    path('crear-alumno', AlumnoCreateView.as_view(), name='crear-alumno'),
    path('alumno/<int:colegio_id>/listar-alumno', AlumnoListView.as_view(), name='listar-alumno'),
    path('alumno/<int:colegio_id>/listar-alumno/<int:curso_id>', AlumnoListView.as_view(), name='listar-alumno'),
    path('alumno/<int:alumno_id>/listar-detalle-alumno', AlumnoDetailView.as_view(), name='listar-detalle-alumno'),
    path('alumno/<int:alumno_id>/update', AlumnoUpdateView.as_view(), name='alumno-update'),
    
    # URL Profesor
    path('crear-profesor', ProfesorCreateView.as_view(), name='crear-profesor'),
    path('profesor/<int:colegio_id>/listar-profesor', ProfesorListView.as_view(), name='listar-profesor'),
    path('profesor/<int:colegio_id>/<int:profesor_id>/listar-profesor', ProfesorListView.as_view()),
    path('profesor/<int:profesor_id>/update', ProfesorUpdateView.as_view(), name='profesor-update'),
    path('profesor/<int:profesor_id><int:colegio_id>/delete', ProfesorDeleteColegioView.as_view(), name='profesor-delete'),

    # URL Clase
    path('crear-clase', ClaseCreateView.as_view(), name='crear-clase'),
    path('clase/<int:clase_id>/update', ClaseUpdateView.as_view(), name='clase-update'),
    path('clase/<int:curso_id>/<int:asignatura_id>/listar-clases', ClaseListView.as_view(), name='listar-clases'),

    # URL Asistencia
    path('crear-asistencia/<int:clase_id>', AsistenciaCreateView.as_view(), name='crear-asistencia'),
    path('listar-asistencia/<int:alumno_id>', AsistenciaDetailView.as_view(), name='listar-asistencia-alumno'),
    path('listar-asistencia/clase/<int:clase_id>', AsistenciaListProfesorView.as_view(), name='historial-asistencia-clases'),
    path('listar-asistencia/<int:colegio_id>/<str:fecha>', AsistenciaListAdminView.as_view(), name='historial-asistencia-cursos'),
    path('asistencia/<int:asistencia_id>/update', AsistenciaUpdateView.as_view(), name='update-asistencia'),
    
    # URL FechaImportante
    path('crear-fecha', FechaImportanteCreateView.as_view(), name='crear-fecha'),
    path('curso/<int:curso_id>/<int:asignatura_id>/listar-fechas', FechaImportanteListView.as_view(), name='listar-fechas'),
    path('curso/<int:curso_id>/listar-fechas', FechaImportanteListView.as_view(), name='listar-fechas-curso'),
    path('curso/<int:fecha_id>/update', FechaImportanteUpdateView.as_view(), name='fecha-update'),
    path('curso/<int:fecha_id>/delete', FechaImportanteDeleteView.as_view(), name='fecha-delete'),
    
    # URL Calificaciones
    path('crear-nota/<int:asignatura_id>/', CalificacionesCreateView.as_view(), name='crear-notas-alumno'),
    path('alumno/<int:alumno_id>/listar-notas', CalificacionesListView.as_view(), name='listar-notas-alumno'),
    path('alumno/<int:alumno_id>/<int:asignatura_id>/listar-notas', CalificacionesListView.as_view(), name='listar-notas-asignatura'),
    path('nota/update', CalificacionesUpdateView.as_view(), name='update-notas'),
]
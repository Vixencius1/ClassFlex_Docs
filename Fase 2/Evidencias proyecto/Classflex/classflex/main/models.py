from django.db import models
from login.models import Usuario
from django.utils import timezone
from datetime import datetime
from django.core.validators import MinValueValidator, MaxValueValidator

class Colegio(models.Model):
    nombre = models.CharField(max_length=60, blank=False, null=False)
    direccion = models.CharField(max_length=60, blank=True, null=False)
    ciudad = models.CharField(max_length=30, blank=True, null=False)
    region = models.CharField(max_length=30, blank=True, null=False)
    contacto = models.CharField(max_length=12, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'Colegio'
        verbose_name = 'Colegio'
        verbose_name_plural = 'Colegios'
    
    def __str__(self):
        return self.nombre

class Administrador(models.Model):
    nombre = models.CharField(max_length=50)
    apellido_paterno = models.CharField(max_length=50)
    apellido_materno = models.CharField(max_length=50)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, default=None, null=True)
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE, null=True)

    # Nombre que aparece en el panel de Django admin
    class Meta:
        managed = True
        db_table = 'Administrador'
        verbose_name = 'Administrador'
        verbose_name_plural = 'Administradores'

    def __str__(self):
        return f"{self.nombre} {self.apellido_paterno}"

class Departamento(models.Model):
    departamento = models.CharField(max_length=60, blank=False, null=False)
    
    class Meta:
        managed = True
        db_table = 'Departamento'
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'
    
    def __str__(self):
        return self.departamento
    
class Asignatura(models.Model):
    asignatura = models.CharField(max_length=60, blank=False, null=False)
    descripcion = models.CharField(max_length=200, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, editable=False)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, default=None, null=True)
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE, null=True)
    cant_notas = models.IntegerField(null=False, blank=False, default=7,
                                     validators=[MaxValueValidator(10),MinValueValidator(1)])

    class Meta:
        managed = True
        db_table = 'Asignatura'
        verbose_name = 'Asignatura'
        verbose_name_plural = 'Asignaturas'
    
    def __str__(self):
        return self.asignatura

class Curso(models.Model):
    curso = models.CharField(max_length=30)
    nivel = models.IntegerField(default=1,validators=[MaxValueValidator(12),MinValueValidator(1)])
    cupos = models.IntegerField(default=30, validators= [MinValueValidator(0)])
    colegio = models.ForeignKey('Colegio', on_delete=models.CASCADE, blank=True, null=True)
    asignaturas = models.ManyToManyField(Asignatura, related_name='cursos')

    class Meta:
        managed = True
        db_table = 'Curso'
        verbose_name = 'Curso'
        verbose_name_plural = 'Cursos'
    
    def __str__(self):
        return f"{self.curso} - Nivel {self.nivel}"

class Profesor(models.Model):
    rut = models.CharField(max_length=12, blank=False, null=False)
    nombre = models.CharField(max_length=50, blank=False, null=False)
    apellido_paterno = models.CharField(max_length=50, blank=True, null=False)
    apellido_materno = models.CharField(max_length=50, blank=True, null=False)
    contacto = models.CharField(max_length=12, blank=True, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, default=None, null=True)
    colegios = models.ManyToManyField(Colegio, related_name='profesores')
    cursos = models.ManyToManyField(Curso, related_name='profesores')
    asignaturas = models.ManyToManyField(Asignatura, related_name='profesores')

    # Nombre que aparece en el panel de Django admin
    class Meta:
        managed = True
        db_table = 'Profesor'
        verbose_name = 'Profesor'
        verbose_name_plural = 'Profesores'

    def __str__(self):
        return f"{self.nombre} {self.apellido_paterno}"

class Alumno(models.Model):
    rut = models.CharField(max_length=12)
    nombre = models.CharField(max_length=50)
    apellido_paterno = models.CharField(max_length=50)
    apellido_materno = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField(null=True)
    direccion = models.CharField(max_length=60)
    foto = models.CharField(max_length=240)
    fecha_matricula = models.DateField(null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, default=None, null=True)
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE, null=True)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, null=True)
    
    # Nombre que aparece en el panel de Django admin
    class Meta:
        managed = True
        db_table = 'Alumno'
        verbose_name = 'Alumno'
        verbose_name_plural = 'Alumnos'
    
    def __str__(self):
        return f"{self.nombre} {self.apellido_paterno}"
    
class Semestre(models.Model):
    SEMESTRES = [
        ('1', 'Primer Semestre'),
        ('2', 'Segundo Semestre'),
    ]
    
    semestre = models.CharField(max_length=20, choices=SEMESTRES)
    annio = models.CharField(max_length=4, default=str(datetime.now().year))
    
    class Meta:
        managed = True
        db_table = 'Semestre'
        verbose_name = 'Semestre'
        verbose_name_plural = 'Semestres'
    
    def __str__(self):
        return f"{self.get_semestre_display()} {self.annio}"

    def save(self, *args, **kwargs):
        if not self.annio:
            self.annio = str(datetime.now().year)
        super().save(*args, **kwargs)

class Clase(models.Model):
    comentario = models.TextField(blank=True, null=True)
    fecha = models.DateField(auto_now_add=True, null=True)
    hora_inicio = models.TimeField()
    hora_termino = models.TimeField()
    activa = models.BooleanField(default=True)
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    alumnos = models.ManyToManyField(Alumno, related_name='clases')
    
    # Nombre que aparece en el panel de Django admin
    class Meta:
        managed = True
        db_table = 'Clase'
        verbose_name = 'Clase'
        verbose_name_plural = 'Clases'
    
    def __str__(self):
        return f"{self.asignatura} - {self.curso} ({self.fecha} - {self.hora_inicio} - {self.hora_termino})"
    
class Asistencia(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name='asistencias')
    clase = models.ForeignKey(Clase, on_delete=models.CASCADE, related_name='asistencias')
    fecha = models.DateField(auto_now_add=True)
    presente = models.BooleanField(default=False)
    justificado = models.BooleanField(default=False)

    class Meta:
        db_table = 'Asistencia'
        verbose_name = 'Asistencia'
        verbose_name_plural = 'Asistencias'
        unique_together = ('alumno', 'clase', 'fecha')

    def __str__(self):
        return f"{self.alumno} - {self.clase} ({'Asistió' if self.presente else 'No asistió'})"

class Calificacion(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name='calificaciones')
    asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE, related_name='calificaciones', null=True)
    nota = models.DecimalField(
        max_digits=3, 
        decimal_places=1, 
        validators=[
            MinValueValidator(1.0),
            MaxValueValidator(7.0)
        ],
        default=1.0
    )
    tipo_evaluacion = models.CharField(max_length=255, blank=True, null=True)
    fecha = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'Calificacion'
        verbose_name = 'Calificacion'
        verbose_name_plural = 'Calificaciones'
        

    def __str__(self):
        alumno = self.alumno
        asignatura = self.asignatura
        nota = self.nota
        tipo_evaluacion = self.tipo_evaluacion
        
        return f"{alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno} - {asignatura}: {nota} ({tipo_evaluacion})"

class FechaImportante(models.Model):
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='fechas_importantes')
    asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE, default=2)
    evento = models.CharField(max_length=200, blank=False)
    fecha = models.DateField()
    
    class Meta:
        managed = True
        db_table = 'FechaImportante'
        verbose_name = 'Fecha Importante'
        verbose_name_plural = 'Fechas Importantes'
    
    def __str__(self):
        return f"{self.evento} - {self.fecha.strftime('%d/%m/%Y')} ({self.curso}, {self.asignatura.asignatura})"

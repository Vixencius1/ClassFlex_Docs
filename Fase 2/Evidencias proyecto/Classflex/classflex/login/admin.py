from django.contrib import admin
from .models import Usuario

# Personalización del panel de admin, tabla Usuarios
class UsuarioAdmin(admin.ModelAdmin):

    # Listado de columnas incial que se muestran en pantalla
    list_display = ('email','is_active', 'is_staff')

    # Columnas no modificables
    readonly_fields = ('last_login', 'date_joined','password')

    # Separación de columnas por grupos
    fieldsets = (
        ('Datos del usuario', {'fields': ('email', 'password')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )

# Registrar tabla en panel de administrador
admin.site.register(Usuario, UsuarioAdmin)

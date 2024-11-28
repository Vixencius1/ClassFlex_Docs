from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import Usuario, Rol
from main.models import Colegio

# Serialización para interfaz de api
class UserSerializer(serializers.ModelSerializer):
    # Cambia el campo 'role' para aceptar el ID del rol proporcionado
    role = serializers.PrimaryKeyRelatedField(queryset=Rol.objects.all(), required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'role','is_active']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Validar email y eliminar espacios en blanco
    def validate_email(self, value):
        value = value.replace(" ", "")
        return value

    # Crear nuevo usuario
    def create(self, validated_data):
        # Si no se proporciona un rol, asignar por defecto el rol 'Student'
        if 'role' not in validated_data:
            validated_data['role'] = Rol.objects.get(nombre='Student')
        else:
            # Si el rol es proporcionado como un número (id), convertirlo a una instancia del modelo Rol
            if isinstance(validated_data['role'], int):
                validated_data['role'] = Rol.objects.get(id=validated_data['role'])

        # Extraer la contraseña del validated_data
        password = validated_data.pop('password', None)
        # Crear la instancia del modelo Usuario
        instance = self.Meta.model(**validated_data)

        # Asignar la contraseña solo si se proporciona
        if password is not None:
            instance.set_password(password)
        
        # Guardar la nueva instancia de usuario
        instance.save()
        return instance

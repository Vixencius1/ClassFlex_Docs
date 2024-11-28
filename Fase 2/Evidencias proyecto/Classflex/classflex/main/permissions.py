from rest_framework.permissions import BasePermission

class AdminPermission(BasePermission):

    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        
        if request.user.is_authenticated and request.user.is_staff and request.user.role == 'admin':
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        if request.user.is_authenticated and request.user.is_staff and request.user.role == 'admin':
            return True
        return False

class ProfesorPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role == 'professor':
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and request.user.role == 'professor':
            return True
        return False

class AlumnoPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role == 'student':
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and request.user.role == 'student':
            return True
        return False
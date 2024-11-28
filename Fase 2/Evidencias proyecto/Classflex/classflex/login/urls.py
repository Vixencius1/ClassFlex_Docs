from django.urls import path
from .views import *

urlpatterns = [
    # Urls para verificar/usar creación y reset de contraseña
    path('verify-token', VerifyResetTokenView.as_view(), name='verify-token'),
    path('verify-create-token', VerifyCreateTokenView.as_view(), name='verify-token'),
    path('register', RegisterView.as_view(), name='register'),
    path('create-password', CreatePasswordView.as_view(), name='create-password'),

    # Urls para login
    path('login', LoginView.as_view(), name='login'),
    path('user', UserView.as_view(), name='user'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('usuarios/colegio/<int:usuario_id>/', UserListView.as_view(), name='usuarios_por_colegio'),
    path('usuarios/<int:usuario_id>/update', UserUpdateView.as_view(), name='actualizar-usuario'),

    # Urls para cambio de contraseña
    path('change-password', ChangePasswordView.as_view(), name='change-password'),
    path('reset-password', ResetPasswordView.as_view(), name='reset-password'),
    
    # Urls para los dashboards específicos de roles
    path('admin-dashboard', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('student-dashboard', StudentDashboardView.as_view(), name='student-dashboard'),
    path('professor-dashboard', ProfessorDashboardView.as_view(), name='professor-dashboard'),
]
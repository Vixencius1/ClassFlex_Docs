import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import Login from "./Login/Login.js";
import Home from "./Home/Home.js";
import ResetPassword from "./ResetPassword/ResetPassword.js";
import ResetPasswordForm from "./ResetPasswordForm/ResetPasswordForm.js";
import CreatePasswordForm from "./CreatePasswordForm/CreatePasswordForm.js";
import { AdminDashboard } from "./Dashboard/AdminDashboard";
import { GestionAsignaturasAdmin } from "./Dashboard/AdminDashboard/GestionAsignaturasAdmin";
import { GestionCursosAdmin } from "./Dashboard/AdminDashboard/GestionCursosAdmin";
import { GestionAlumnosAdmin } from "./Dashboard/AdminDashboard/GestionAlumnosAdmin";
import { GestionProfesoresAdmin } from "./Dashboard/AdminDashboard/GestionProfesoresAdmin";
import { StudentDashboard } from "./Dashboard/StudentDashboard";
import { ProfessorDashboard } from "./Dashboard/ProfessorDashboard";
import { GestionCursoProfesor } from "./Dashboard/ProfessorDashboard/GestionCursoProfesor";
import SelectorColegios from "./SelectorColegios/SelectorColegios.js";
import { GestionClaseProfesor } from "./Dashboard/ProfessorDashboard/GestionClaseProfesor";
import { GestionNotasProfesor } from "./Dashboard/ProfessorDashboard/GestionNotasProfesor";
import { HistorialAsistencias } from "./Dashboard/ProfessorDashboard/HistorialAsistencias";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // Estado para el usuario autenticado
  const imageSrc = "ClassFlex__logo_grande.svg";

  // Verifica si hay un token en localStorage al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const colegio = localStorage.getItem("colegio");

    if (token) {
      const userData = {
        jwt: token,
        role,
        colegio,
      };
      setUser(userData);
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }

    // Simulación de la carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData); // Almacena la información del usuario
    localStorage.setItem("token", userData.jwt); // Guarda el token en localStorage
  };

  const handleLogout = () => {
    setUser(null); // Limpia el estado del usuario
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("colegio");
    window.dispatchEvent(
      new StorageEvent("storage", { key: "token", newValue: null })
    );
  };

  const ProtectedRoute = ({ children, role }) => {
    if (!user) {
      return <Navigate to="/" />; // Redirige al login si no está autenticado
    }
    if (user.role !== role) {
      return <Navigate to="/home" />; // Redirige si no tiene el rol adecuado
    }
    return children; // Permite el acceso si el rol es correcto
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="image-container">
          <img src={imageSrc} alt="Classflex" />
        </div>
        <div className="loader-container">
          <TailSpin color="#00BFFF" height={80} width={80} />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header"></header>
        <div className="app-body">
          <Routes>
            {/* Ruta inicial para el login */}
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            {/* Ruta para el home */}
            <Route path="/home" element={<Home />} />
            {/* Rutas para recuperar contraseña */}
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/reset-password/:uid/:token"
              element={<ResetPasswordForm />}
            />
            {/* Ruta para crear contraseña */}
            <Route
              path="/create-password/:uid/:token"
              element={<CreatePasswordForm />}
            />
            {/* Rutas para los dashboards, protegidas por rol */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/gestion-asignaturas"
              element={
                <ProtectedRoute role="admin">
                  <GestionAsignaturasAdmin onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/gestion-alumnos"
              element={
                <ProtectedRoute role="admin">
                  <GestionAlumnosAdmin onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/gestion-profesores"
              element={
                <ProtectedRoute role="admin">
                  <GestionProfesoresAdmin onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/gestion-cursos"
              element={
                <ProtectedRoute role="admin">
                  <GestionCursosAdmin onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/selector-colegios"
              element={
                <ProtectedRoute role="professor">
                  <SelectorColegios onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor-dashboard"
              element={
                <ProtectedRoute role="professor">
                  <ProfessorDashboard onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor-dashboard/curso"
              element={
                <ProtectedRoute role="professor">
                  <GestionCursoProfesor onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor-dashboard/curso/clase"
              element={
                <ProtectedRoute role="professor">
                  <GestionClaseProfesor onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor-dashboard/curso/calificaciones"
              element={
                <ProtectedRoute role="professor">
                  <GestionNotasProfesor onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/professor-dashboard/curso/historial-asistencias"
              element={
                <ProtectedRoute role="professor">
                  <HistorialAsistencias onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <footer className="app-footer"></footer>
      </div>
    </Router>
  );
}

import "./Sidebar.css";
import React, { useState } from "react";
import Logo from "../Logo/Logo.js";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import axios from "axios";
import { CiLogout } from "react-icons/ci";
import { FaBars } from "react-icons/fa";
import { links } from "../../data/links.js";

// Función principal del sidebar
export default function Sidebar() {
  // Estado para manejar cuando el sidebar se expande o colapsa
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  // Función para cerrar sesión usando api Django
  const handleLogout = () => {
    const channel = new BroadcastChannel('sesion_channel');
    channel.postMessage('logout');
    axios
      .post("http://localhost:8000/api/logout")
      .then((response) => {
        window.location.href = "/";
        localStorage.removeItem('colegio');
        localStorage.removeItem('role');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Función para alternar el sidebar
  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <>
      {/* Botón de hamburguesa fuera del sidebar */}
      <FaBars className="sidebar-toggle" size={30} onClick={toggleSidebar} />

      {/* Sidebar container */}
      <Container
        className={`d-flex flex-column align-items-center sidebar ${
          isSidebarExpanded ? "expanded" : ""
        }`}
        id="sidebar-container"
      >
        {/* Logo */}
        <div className="logo-container mb-5 d-flex justify-content-between align-items-center w-100">
          <Logo />
        </div>

        {/* Manejo de enlaces del sidebar */}
        <Nav className="nav-sidebar flex-column">
          {/* Lista los links del archivo 'data/links.js' */}
          {links.map((link, index) => (
            <Nav.Link key={index} href={link.path}>
              {link.icon}
              <span>{link.text}</span>
            </Nav.Link>
          ))}

          {/* Agrega el link de cerrar sesión */}
          <Nav.Link className="mt-auto" onClick={handleLogout}>
            <CiLogout size={20} className="icon-spacing" />
            <span>Cerrar sesión</span>
          </Nav.Link>
        </Nav>
      </Container>
    </>
  );
}

import "./styles.css";
import React from "react";

const NavUsername = ({ nombre }) => {
  return (
    <p className="user">
      Bienvenido(a),
      <br />
      <span className="user-name">{nombre}</span>
    </p>
  );
}

export default NavUsername;
import "./styles.css";
import React from "react";

const NavForm = ({colegio, curso=null }) => {
  return (
    <div className="colegio-container">
      {colegio ? (curso ? <h3>{curso}<br />{colegio.nombre}</h3> : <h3>{colegio.nombre}</h3>) : <h3>Colegio no encontrado</h3>}
    </div>
  );
};

export default NavForm;
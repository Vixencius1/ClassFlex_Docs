import "./styles.css";
import React, { useEffect} from "react";
import { Container } from "react-bootstrap";
import { initializeChannel } from "../../../../data/broadcastChannel.js";
import { useFetchProfesorData } from "../../../Hooks/useFetchProfesorData.js";
import GestionCurso from "./GestionCurso.jsx";
import NavbarUser from "../../../Navbar/NavbarUser.jsx";

export default function GestionCursoProfesor() {
  // const [profesorObject, setProfesorObject] = useState(null);
  // const [nombreProfesor, setNombreProfesor] = useState("");
  const curso = JSON.parse(localStorage.getItem("curso") || "[]");
  const asignatura = JSON.parse(localStorage.getItem("asignatura") || "[]");
  const rutaBackButton = "/professor-dashboard";

  const colegioId = localStorage.getItem("colegio");
  const profesorId = localStorage.getItem("profesor_id");

  const { profesorObject, nombreProf, loading, error } = useFetchProfesorData(colegioId, profesorId);

  useEffect(() => {
    localStorage.removeItem("hasReloaded");
    const channel = initializeChannel();

    return () => {
      channel.close();
    };
  }, []);

  // Manejo de estados de carga y error
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container fluid md={12}>
      <NavbarUser user={profesorObject} backButton={rutaBackButton} />
      <GestionCurso
        curso={curso}
        asignatura={asignatura}
        profesor={nombreProf}
      />
    </Container>
  );
}

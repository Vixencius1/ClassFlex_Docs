import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({baseURL: 'http://localhost:8000/api/main/'});

export const useFetchProfesorData = (colegioId, profesorId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profesorObject, setProfesorObject] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [nombreProf, setNombreProf] = useState(null);
  const [colegios, setColegios] = useState([]);

  useEffect(() => {
    const fetchProfesorData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`profesor/${colegioId}/${profesorId}/listar-profesor`);
        setProfesorObject(response.data);
        setCursos(response.data.cursos.filter(curso => curso.colegio === parseInt(colegioId)));
        setNombreProf(`${response.data.nombre} ${response.data.apellido_paterno} ${response.data.apellido_materno}`);
        setColegios(response.data.colegios);
      } catch (error) {
        setError("Error al cargar los datos del profesor.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (colegioId && profesorId) {
      fetchProfesorData();
    }
  }, [colegioId, profesorId]);

  return { profesorObject, cursos, nombreProf, colegios, loading, error };
};
import { FaHome } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";

export const links = [
  {
    icon: <FaHome size={20} className="icon-spacing" />,
    text: "Home",
    path: "#/admin-dashboard"
  },
  {
    icon: <FaBookOpenReader size={20} className="icon-spacing" />,
    text: "Gestionar asignaturas",
    path: "#/admin-dashboard/gestion-asignaturas"
  },
  {
    icon: <GiTeacher size={20} className="icon-spacing" />,
    text: "Gestionar profesores",
    path: "#/admin-dashboard/gestion-profesores"
  },
  {
    icon: <PiStudentBold size={20} className="icon-spacing" />,
    text: "Gestionar alumnos",
    path: "#/admin-dashboard/gestion-alumnos"
  },
  {
    icon: <FaPencilAlt size={20} className="icon-spacing" />,
    text: "Gestionar cursos",
    path: "#/admin-dashboard/gestion-cursos"
  },
];

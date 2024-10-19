import RegistrationForm from "@/components/classroom-registration-form";
import { fetchAlumnos, fetchMaterias, fetchProfesores } from "@/lib/data";
import { Materia, Usuario } from "@/lib/definitions";


export default async function ClassRoomCreationDashboard() {
    const alumnos: Usuario[] = await fetchAlumnos();
    const profesores: Usuario[] = await fetchProfesores();
    const materias: Materia[] = await fetchMaterias();
    return <RegistrationForm alumnos={alumnos} profesores={profesores} materias={materias}/>;

}
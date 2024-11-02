import ModificationForm from "@/components/classroom-modification-form";
import { fetchAlumnos, fetchProfesores } from "@/lib/data";
import { Usuario } from "@/lib/definitions";


export default async function ClassRoomModificationDashboard({ params }: { params: { 'id-aula': string } }) {
    const { 'id-aula': aulaId } = params;
    const alumnos: Usuario[] = await fetchAlumnos();
    const profesores: Usuario[] = await fetchProfesores();

    return <ModificationForm aulaId={aulaId} profesores={profesores} alumnos={alumnos}/>;
}
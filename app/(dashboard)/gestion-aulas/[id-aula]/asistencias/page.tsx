import ModificationForm from "@/components/classroom-modification-form";
import { fetchAlumnos, fetchProfesores, fetchAulaById } from "@/lib/data";
import { Aula, Usuario } from "@/lib/definitions";


export default async function ClassRoomModificationDashboard({ params }: { params: { 'id-aula': string } }) {
    const { 'id-aula': aulaId } = params;
    const aula: Aula = await fetchAulaById(aulaId);
    const alumnos: Usuario[] = await fetchAlumnos();
    const profesores: Usuario[] = await fetchProfesores();
    
    return <ModificationForm aula={aula} profesores={profesores} alumnos={alumnos}/>;
}
import ClassRoomList from "@/components/classroom-list";
import { Aula } from "@/lib/definitions";


export default async function GestionAulas() {

   const aulas: Aula[] = [
        {
            codigo: 'Aula 1',
            materia: 'Matematicas',
            turno: 'Mañana',
            año: '2022',
            profesores: ['Professor 1'],
            alumnos: ['Alumno 1', 'Alumno 2']
        },
        {
            codigo: 'Aula 2',
            materia: 'Lengua',
            turno: 'Tarde',
            año: '2023',
            profesores: ['Professor 2'],
            alumnos: ['Alumno 3', 'Alumno 4']
        },
    ]

    return<>
        <div>Gestion de Aulas</div>
        <ClassRoomList aulas={aulas} />
    </>
}
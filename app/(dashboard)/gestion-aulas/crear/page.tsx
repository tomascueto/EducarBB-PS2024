import RegistrationForm from "@/components/classroom-registration-form";
import { Materia, Usuario } from "@/lib/definitions";

const alumnos: Usuario[] = [
    { dni: '12345678', nombres: 'Student 1' },
    { dni: '87654321', nombres: 'Student 2' },
];

const profesores: Usuario[] = [
    { dni: '11111111', nombres: 'Teacher 1' },
    { dni: '22222222', nombres: 'Teacher 2' },
];

const materias: Materia[] = [
    { codigo: 'MAT001', nombre: 'Mathematics', plan: undefined },
    { codigo: 'LFA101', nombre: 'Formal Languages and Automata', plan: undefined },
    { codigo: 'FIS102', nombre: 'Physics I', plan: undefined },
    { codigo: 'BD200', nombre: 'Databases', plan: undefined },
];

export default function ClassRoomCreationDashboard() {
    return <RegistrationForm alumnos={}/>;

}
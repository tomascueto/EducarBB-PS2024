import RegistrationForm from "@/components/classroom-registration-form";
import { Materia, Usuario } from "@/lib/definitions";

//     dni: string;
//     nombres: string;
//     apellido: string;
//     email: string;
//     contraseña: string;
//     fechanacimiento: string;
//     rol: string;
const alumnos: Usuario[] = [
    { dni: '12345678', nombres: 'Student 1', apellido: 'Student 1', email: 'Gv3J7@example.com', contraseña: '1234567890', fechanacimiento: '2000-01-01', rol: 'Alumno' },
    { dni: '87654321', nombres: 'Student 2', apellido: 'Student 2', email: 'Gv3J7@example.com', contraseña: '1234567890', fechanacimiento: '2000-01-01', rol: 'Alumno' },
];

const profesores: Usuario[] = [
    { dni: '11111111', nombres: 'Teacher 1', apellido: 'Teacher 1', email: 'Gv3J7@example.com', contraseña: '1234567890', fechanacimiento: '2000-01-01', rol: 'Profesor' },
    { dni: '22222222', nombres: 'Teacher 2', apellido: 'Teacher 2', email: 'Gv3J7@example.com', contraseña: '1234567890', fechanacimiento: '2000-01-01', rol: 'Profesor' },
];

const materias: Materia[] = [
    { codigo: 'MAT001', nombre: 'Mathematics', plan: undefined },
    { codigo: 'LFA101', nombre: 'Formal Languages and Automata', plan: undefined },
    { codigo: 'FIS102', nombre: 'Physics I', plan: undefined },
    { codigo: 'BD200', nombre: 'Databases', plan: undefined },
];

export default function ClassRoomCreationDashboard() {
    return <RegistrationForm alumnos={alumnos} profesores={profesores} materias={materias}/>;

}
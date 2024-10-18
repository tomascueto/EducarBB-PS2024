
import StudyPlanList from '@/components/studyplan-list';
import { Materia, PlanEstudio } from '@/lib/definitions';

export default async function AdminDashboard() {

    // Lista provisoria de planes
    const planes: PlanEstudio[] = [
    {
        "nombre": "Ingeniería en Sistemas de Información",
        "materias": [
            { "materia": { codigo: 'MAT001', nombre: 'Matemáticas', plan: undefined }, "año": "1" },
            { "materia": { codigo: 'LFA101', nombre: 'Lenguajes Formáles y Autómatas', plan: undefined }, "año": "2" },
            { "materia": { codigo: 'FIS102', nombre: 'Física I', plan: undefined }, "año": "3" },
            { "materia": { codigo: 'BD200', nombre: 'Bases de Datos', plan: undefined }, "año": "4" }
        ]
    },
    {
        "nombre": "Licenciatura en Matemática",
        "materias": [
            { "materia": { codigo: 'MAT001', nombre: 'Matemáticas', plan: undefined }, "año": "1" }
        ]
    },
    {
        "nombre": "Licenciatura en Física",
        "materias": [
            { "materia": { codigo: 'MAT001', nombre: 'Matemáticas', plan: undefined }, "año": "1" },
            { "materia": { codigo: 'FIS102', nombre: 'Física I', plan: undefined }, "año": "1" },
        ]
    }
    ]

    return(
        <>
            <div>Admin Dashboard</div>
            <StudyPlanList planes={planes} />
        </>
    );



}
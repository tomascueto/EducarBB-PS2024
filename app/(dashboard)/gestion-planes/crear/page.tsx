import StudyPlanForm from "@/components/studyplan-registration-form";
import { fetchMaterias } from "@/lib/data";
import { Materia } from "@/lib/definitions";
    
export default async function UserCreationDashboard(){

    const materias: Materia[] = await fetchMaterias();

    // Lista provisoria de materias
    // const materias: Materia[] = [
    //     { codigo: 'MAT001', nombre: 'Matemáticas', plan: undefined },
    //     { codigo: 'LFA101', nombre: 'Lenguajes Formáles y Autómatas', plan: undefined },
    //     { codigo: 'FIS102', nombre: 'Física I', plan: undefined },
    //     { codigo: 'BD200', nombre: 'Bases de Datos', plan: undefined },
    //     ];

    return(
        <StudyPlanForm materias={materias}/>
    )
    
}
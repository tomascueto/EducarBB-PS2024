
import SubjectList from '@/components/subject-list';
import { Materia } from '@/lib/definitions';

export default async function AdminDashboard() {
    
    //const materias: Materia[] = await fetchMaterias();
 

    // Lista provisoria de materias
    const materias: Materia[] = [
        { codigo: 'MAT001', nombre: 'Matemáticas', plan: undefined },
        { codigo: 'LFA101', nombre: 'Lenguajes Formáles y Autómatas', plan: undefined },
        { codigo: 'FIS102', nombre: 'Física I', plan: undefined },
        { codigo: 'BD200', nombre: 'Bases de Datos', plan: undefined },
      ];
    
    return(
        <>
            <div>Admin Dashboard</div>
            <SubjectList materias={materias} />
        </>
    );



}
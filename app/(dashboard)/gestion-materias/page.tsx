
import SubjectList from '@/components/subject-list';
import { fetchMaterias } from '@/lib/data';
import { Materia } from '@/lib/definitions';

export default async function AdminDashboard() {
    
    const materias: Materia[] = await fetchMaterias();
    
    return(
        <>
            <div className="text-2xl font-bold text-center text-blue-500">Gestion de Materias</div>
            <SubjectList materias={materias} />
        </>
    );
}
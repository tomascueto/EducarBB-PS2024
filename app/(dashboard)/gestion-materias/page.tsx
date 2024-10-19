
import SubjectList from '@/components/subject-list';
import { fetchMaterias } from '@/lib/data';
import { Materia } from '@/lib/definitions';

export default async function AdminDashboard() {
    
    const materias: Materia[] = await fetchMaterias();
    
    return(
        <>
            <div>Admin Dashboard</div>
            <SubjectList materias={materias} />
        </>
    );
}
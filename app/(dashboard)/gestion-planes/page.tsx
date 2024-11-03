
import StudyPlanList from '@/components/studyplan-list';
import { fetchPlanes } from '@/lib/data';
import { PlanEstudio } from '@/lib/definitions';

export default async function AdminDashboard() {

    const planes: PlanEstudio[] = await fetchPlanes();
    
    return(
        <>
            <div className="text-2xl font-bold text-center text-blue-500">Planes de Estudio</div>
            <StudyPlanList planes={planes} />
        </>
    );
}
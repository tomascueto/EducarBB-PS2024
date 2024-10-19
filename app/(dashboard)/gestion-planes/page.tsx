
import StudyPlanList from '@/components/studyplan-list';
import { fetchPlanes } from '@/lib/data';
import { PlanEstudio } from '@/lib/definitions';

export default async function AdminDashboard() {

    const planes: PlanEstudio[] = await fetchPlanes();
    
    return(
        <>
            <div>Planes de Estudio</div>
            <StudyPlanList planes={planes} />
        </>
    );
}
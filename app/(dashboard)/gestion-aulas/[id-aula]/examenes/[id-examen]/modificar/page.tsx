import ModificationForm from "@/components/exam-modification-form";
import { fetchExamenById } from "@/lib/data";
import { Examen } from "@/lib/definitions";


export default async function ExamCreationDashboard({ params }: { params: { 'codigo': string } }) {
    const { 'codigo': aulaId } = params;
    const examen: Examen = await fetchExamenById(aulaId);

    return <ModificationForm alumnos={examen.alumnos} aulaId={aulaId}/>;

}
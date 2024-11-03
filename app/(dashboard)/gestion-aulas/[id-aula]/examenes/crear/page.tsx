import RegistrationForm from "@/components/exam-registration-form";
import { fetchAulaById } from "@/lib/data";
import { Aula } from "@/lib/definitions";


export default async function ExamCreationDashboard({ params }: { params: { 'id-aula': string } }) {
    const { 'id-aula': aulaId } = params;
    const aula: Aula = await fetchAulaById(aulaId);

    return <RegistrationForm alumnos={aula.alumnos} aulaId={aulaId}/>;

}
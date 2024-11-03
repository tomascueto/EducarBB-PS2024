import ExamsList from "@/components/exams-list";
import { fetchAulaById } from "@/lib/data";
import { Aula, Examen } from "@/lib/definitions";


export default async function ExamsDashboard({ params }: { params: { 'id-aula': string } }) {
    const { 'id-aula': aulaId } = params;
    const aula: Aula = await fetchAulaById(aulaId);
    // const examenes: Examen[] = await fetchExamenes(aulaId);
    const examenes = [{codigo: 'E1', fecha: '2024-10-30', alumnos: []}, {codigo: 'E2', fecha: '2024-11-05', alumnos: []}];
    
    return <ExamsList aula={aula} examenes={examenes}/>;
}
import ModificationForm from "@/components/exam-modification-form";
import { fetchAlumnos, fetchAlumnosFromExamId, fetchExamenById } from "@/lib/data";
import { Examen, Usuario } from "@/lib/definitions";


export default async function ExamModificationDashboard({ params }: { params: { 'id-aula':string, 'id-examen': string } }) {
    const { 'id-examen': codigo, 'id-aula':aulaId } = params;
 
    const examen: Examen = await fetchExamenById(codigo);
    const alumnos = await fetchAlumnosFromExamId(examen.codigo);
    const examWithAlumnos: Examen = {
        ...examen,
        alumnos: alumnos.map((alumnoData) => ({
            alumno: {
            dni: alumnoData.alumno.dni,
            nombres: alumnoData.alumno.nombres,
            apellido: alumnoData.alumno.apellido,
            email: alumnoData.alumno.email,
            contraseña: '',
            fechanacimiento: alumnoData.alumno.fechanacimiento,
            rol: '',
            },

            nota: alumnoData.nota,
        })),
        };

    return <ModificationForm aulaId={aulaId} existingExam={examWithAlumnos}/>;

}
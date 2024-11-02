import { fetchAulaById } from "@/lib/data";
import { Aula } from "@/lib/definitions";

export default async function AulaPage({ params }: { params: { 'id-aula': string } }) {

    const { 'id-aula': idAula } = params;

    const aula: Aula = await fetchAulaById(idAula);

    return (<>
        <div className="flex items-center justify-center">
            <div>Aula de {aula.nombre}</div>
        </div>
        <div className="flex items-center justify-center">
            <div>Materia: {aula.materia}</div>
        </div>
        <div>{JSON.stringify(aula)}</div>
    </>)
}
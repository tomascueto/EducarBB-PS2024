import { fetchAulaById } from "@/lib/data";
import { Aula } from "@/lib/definitions";
import Link from "next/link";

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

        <div className="flex items-center justify-center space-x-4 mt-4">
            <Link href={`/gestion-aulas/${aula.codigo}/examenes`} className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                    <span>Exámenes</span>
            </Link>
            <Link href={`/gestion-aulas/${aula.codigo}/practicos`} className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded">
                    <span>Trabajos Prácticos</span>
            </Link>
            <Link href={`/gestion-aulas/${aula.codigo}/asistencias`} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded">
                    <span>Asistencias</span>
            </Link>
            <Link href={`/gestion-aulas/${aula.codigo}/amonestaciones`} className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded">
                    <span>Amonestaciones</span>
            </Link>
        </div>
    </>)
}
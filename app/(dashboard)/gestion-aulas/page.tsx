import ClassRoomList from "@/components/classroom-list";
import ListaDeAulas from "@/components/lista-de-aulas";
import { fetchAulas } from "@/lib/data";
import { Aula } from "@/lib/definitions";


export default async function GestionAulas() {

    const aulas: Aula[] = await fetchAulas();
    console.log(aulas);
    
    return<>
        <div className="text-2xl font-bold text-center text-blue-500">Gestion de aulas</div>
        <ListaDeAulas aulas={aulas}/>
    </>
}
import ClassRoomList from "@/components/classroom-list";
import ListaDeAulas from "@/components/lista-de-aulas";
import { fetchAulas } from "@/lib/data";
import { Aula } from "@/lib/definitions";


export default async function GestionAulas() {

    const aulas: Aula[] = await fetchAulas();
    console.log(aulas);
    
    return<>
        <div>Gestion de Aulas</div>
        {/*<ClassRoomList aulas={aulas} />*/}
        <ListaDeAulas aulas={aulas}/>
    </>
}
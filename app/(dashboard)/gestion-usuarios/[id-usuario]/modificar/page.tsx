import ModificationForm from "@/components/user-modification-form";
import { Usuario } from '@/lib/definitions';
import { fetchUsuarioPorDni } from "@/lib/data";

export default async function UserModificationDashboard({ params }: { params: { 'id-usuario': string } }){

    const { 'id-usuario': dni } = params;
    const usuario: Usuario = await fetchUsuarioPorDni(dni);

    return(
        <>
            <div>Modificar Usuario</div>
            <ModificationForm usuario={usuario} />
        </>
    );
}
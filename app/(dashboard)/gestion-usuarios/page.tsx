import { fetchUsuariosConRoles } from '@/lib/data';
import { Usuario } from '@/lib/definitions';
import UserList from '@/components/user-list';

export default async function AdminDashboard() {
    
    const usuarios: Usuario[] = await fetchUsuariosConRoles();
    //console.log(usuarios)
    
    return(
        <>
            <div className="text-2xl font-bold text-center text-blue-500">Gestion de Usuarios</div>
            <UserList usuarios={usuarios} />
        </>
    );
}
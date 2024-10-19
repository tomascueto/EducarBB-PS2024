import { fetchUsuariosConRoles } from '@/lib/data';
import { Usuario } from '@/lib/definitions';
import UserList from '@/components/user-list';

export default async function AdminDashboard() {
    
    const usuarios: Usuario[] = await fetchUsuariosConRoles();
    //console.log(usuarios)
    
    return(
        <>
            <div>Admin Dashboard</div>
            <UserList usuarios={usuarios} />
        </>
    );
}
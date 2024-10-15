import { fetchUsuarios } from '@/lib/data'
import UserList from '../user-list'
import { Usuario } from '@/lib/definitions'

export default async function UserWrapper(){

    const usuarios: Usuario[] = await fetchUsuarios();
    console.log(usuarios)

    return (
        <div>
         <UserList usuarios={usuarios} />
        </div>
    )
}
import { fetchUsuarios } from '@/lib/data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function UserWrapper(){

    const usuarios = await fetchUsuarios();
    console.log(usuarios)

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usuarios.map((user) => (
                        <TableRow key={user.dni}>
                            <TableCell>{user.dni}</TableCell>
                            <TableCell>{user.nombres}</TableCell>
                            <TableCell>{user.apellido}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.rol}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
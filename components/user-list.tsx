'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import Link  from "next/link"
import { borrarUsuario } from '@/lib/actions';
import { Usuario } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UserListProps {
  usuarios: Usuario[];
}

export default function UserList({ usuarios }: UserListProps) {



  const [searchTerm, setSearchTerm] = useState('')
 
  const filteredUsers = usuarios.filter(usuario =>
    usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.dni.includes(searchTerm) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) 
    //usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  )



  const [deleteUser, setDeleteUser] = useState<Usuario | null>(null);

  const handleDelete = async () => {
    if (deleteUser) {
      await borrarUsuario(deleteUser);
      setDeleteUser(null);
      // Aquí podrías agregar lógica para refetch o recargar la página si es necesario
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <Input
          type="search"
          placeholder="Buscar usuario"
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/gestion-usuarios/crear">
          <Button>Crear Nuevo Usuario</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>DNI</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol Institucional</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((usuario) => (
            <TableRow key={usuario.dni}>
              <TableCell>{usuario.dni}</TableCell>
              <TableCell>{usuario.nombres}</TableCell>
              <TableCell>{usuario.apellido}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.rol}</TableCell>
              <TableCell className="text-right">
              <Link href={`/gestion-usuarios/${usuario.dni}/modificar`}>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setDeleteUser(usuario)}>
                  <Trash2 className="h-4 w-4" />
              </Button>

              <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirma que desea eliminar del sistema al usuario:</DialogTitle>
                    <DialogDescription className='text-center'>
                      {deleteUser && (
                        <>
                          <p>{deleteUser.nombres}</p>
                          <p>DNI: {deleteUser.dni}</p>
                          <p>Rol: {deleteUser.rol}</p>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar Usuario</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

interface User {
  id: string
  name: string
  surname: string
  dni: string
  role: string
}

export default function Component() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John', surname: 'Doe', dni: '12345678A', role: 'Admin' },
    { id: '2', name: 'Jane', surname: 'Smith', dni: '87654321B', role: 'User' },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = () => {
    if (deleteUser) {
      setUsers(users.filter(user => user.id !== deleteUser.id))
      setDeleteUser(null)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <Input 
          placeholder="Buscar usuario" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button>Crear Nuevo Usuario</Button>
      </div>
      <div className="space-y-2">
        {filteredUsers.map(user => (
          <div key={user.id} className="flex justify-between items-center p-2 border rounded">
            <span>{user.name} {user.surname}</span>
            <Button variant="ghost" size="icon" onClick={() => setDeleteUser(user)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirma que desea eliminar del sistema al usuario:</DialogTitle>
            <DialogDescription>
              {deleteUser && (
                <>
                  <p>{deleteUser.name} {deleteUser.surname}</p>
                  <p>DNI: {deleteUser.dni}</p>
                  <p>Rol: {deleteUser.role}</p>
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
    </div>
  )
}
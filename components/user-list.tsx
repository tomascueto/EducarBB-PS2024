import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"

interface User {
  id: number
  name: string
  dni: string
  email: string
  role: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', dni: '12345678', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', dni: '87654321', email: 'jane@example.com', role: 'User' },
    // Add more mock users as needed
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.dni.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <Button>Crear Nuevo Usuario</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre Apellido</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol Institucional</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.dni}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
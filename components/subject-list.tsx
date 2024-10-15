'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import Link  from "next/link"
import { borrarMateria } from '@/lib/actions';
import { Materia } from '@/lib/definitions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


interface SubjectListProps {
  materias: Materia[];
}

export default function SubjectList({ materias }: SubjectListProps) {

  const [searchTerm, setSearchTerm] = useState('')
 
  const filteredUsers = materias.filter(materia =>
    materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [deleteSubject, setDeleteSubject] = useState<Materia | null>(null);

  const handleDelete = async () => {
    if (deleteSubject) {
      await borrarMateria(deleteSubject);
      setDeleteSubject(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <Input
          type="search"
          placeholder="Buscar materia"
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/gestion-materias/crear">
          <Button>Crear Nueva Materia</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((materia) => (
            <TableRow key={materia.codigo}>
              <TableCell>{materia.codigo}</TableCell>
              <TableCell>{materia.nombre}</TableCell>
              <TableCell className="text-right">

              <Button variant="ghost" size="icon" onClick={() => setDeleteSubject(materia)}>
                  <Trash2 className="h-4 w-4" />
              </Button>

              <Dialog open={!!deleteSubject} onOpenChange={() => setDeleteSubject(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirma que desea eliminar del sistema la materia:</DialogTitle>
                    <DialogDescription className='text-center'>
                      {deleteSubject && (
                        <>
                          <p>Nombre: {deleteSubject.nombre}</p>
                          <p>Código: {deleteSubject.codigo}</p>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteSubject(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar materia</Button>
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
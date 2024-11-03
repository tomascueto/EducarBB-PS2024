'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import Link  from "next/link"
// import { borrarExamen } from '@/lib/actions';
import { Aula, Examen } from '@/lib/definitions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { borrarExamen } from '@/lib/actions'


interface SubjectListProps {
  aula: Aula,
  examenes: Examen[]
}

export default function ExamsList({ aula, examenes }: SubjectListProps) {

  const [searchTerm, setSearchTerm] = useState('')
 
  const filteredExams = examenes.filter(examen =>
    examen.fecha.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [deleteExam, setDeleteExam] = useState<Examen | null>(null);

  const handleDelete = async () => {
    if (deleteExam) {
      await borrarExamen(deleteExam);
      setDeleteExam(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <Input
          type="search"
          placeholder="Buscar examen"
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href={`/gestion-aulas/${aula.codigo}/examenes/crear`}>
          <Button>Crear Exámen</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {examenes.map((examen) => (
            <TableRow key={examen.codigo}>
              <TableCell>{examen.codigo}</TableCell>
              <TableCell>{examen.fecha}</TableCell>
              <TableCell className="text-right">

              <Button variant="ghost" size="icon" onClick={() => setDeleteExam(examen)}>
                  <Trash2 className="h-4 w-4" />
              </Button>

              <Dialog open={!!deleteExam} onOpenChange={() => setDeleteExam(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirma que desea eliminar del sistema el exámen:</DialogTitle>
                    <DialogDescription className='text-center'>
                      {deleteExam && (
                        <>
                          <p>Código: {deleteExam.codigo}</p>
                          <p>Fecha: {deleteExam.fecha}</p>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteExam(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar Exámen</Button>
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
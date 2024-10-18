'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import Link  from "next/link"
import { borrarPlanEstudio } from '@/lib/actions';
import { PlanEstudio } from '@/lib/definitions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


interface StudyPlanListProps {
  planes: PlanEstudio[];
}

export default function StudyPlanList({ planes }: StudyPlanListProps) {

  const [searchTerm, setSearchTerm] = useState('')
 
  const filteredPlans = planes.filter(plan =>
    plan.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [deleteStudyPlan, setDeleteStudyPlan] = useState<PlanEstudio | null>(null);

  const handleDelete = async () => {
    if (deleteStudyPlan) {
      await borrarPlanEstudio(deleteStudyPlan);
      setDeleteStudyPlan(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <Input
          type="search"
          placeholder="Buscar plan"
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/gestion-planes/crear">
          <Button>Crear Nuevo Plan de Estudios</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlans.map((plan) => (
            <TableRow key={plan.nombre}>
              <TableCell>{plan.nombre}</TableCell>
              <TableCell className="text-right">

              <Button variant="ghost" size="icon" onClick={() => setDeleteStudyPlan(plan)}>
                  <Trash2 className="h-4 w-4" />
              </Button>

              <Dialog open={!!deleteStudyPlan} onOpenChange={() => setDeleteStudyPlan(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirma que desea eliminar del sistema la plan:</DialogTitle>
                    <DialogDescription className='text-center'>
                      {deleteStudyPlan && (
                        <>
                          <p>Nombre: {deleteStudyPlan.nombre}</p>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteStudyPlan(null)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Eliminar Plan de Estudios</Button>
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
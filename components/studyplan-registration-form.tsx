'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { X } from 'lucide-react'
import Link from 'next/link'
import { Materia, Materia_Plan, PlanEstudioState } from '@/lib/definitions'
import { useFormState } from 'react-dom'
import { crearPlan } from '@/lib/actions'

interface SubjectListProps {
  materias: Materia[];
}

// Años para la materia
const años = ['1', '2', '3', '4', '5']


export default function StudyPlanForm({ materias }: SubjectListProps) {
  
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [planSubjects, setPlanSubjects] = useState<Array<Materia_Plan>>([])


  const initialState : PlanEstudioState = { message: "", errors: {} };
  const [state, formAction] = useFormState<PlanEstudioState, FormData>(async (state, formData) => {
    
    planSubjects.forEach((subject, index) => {
      formData.append(`materias[${index}][codigo]`, subject.materia.codigo);
      formData.append(`materias[${index}][year]`, subject.año);
    });
    
    return await crearPlan(state, formData);
  }, initialState);


  const addSubject = () => {
    if (selectedSubject && selectedYear) {
      const materia = materias.find(m => m.codigo === selectedSubject)
      if (materia) {
        setPlanSubjects([...planSubjects, { materia: materia, año: selectedYear }])
        setSelectedSubject('')
        setSelectedYear('')
      }
    }
  }

  const removeSubject = (codigo: string) => {
    setPlanSubjects(planSubjects.filter(materiaPlan => materiaPlan.materia.codigo !== codigo))
  }



  return (
    <form action={formAction} className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex space-x-4">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar Materia" />
          </SelectTrigger>
          <SelectContent>
            {materias.map(materia => (
              <SelectItem key={materia.codigo} value={materia.codigo}>{materia.codigo}/{materia.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {años.map(año => (
              <SelectItem key={año} value={año}>{año}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" onClick={addSubject}>Añadir materia</Button>
      </div>

      <Input
        id="nombre" 
        name="nombre"
        aria-describedby="nombre-error"
        type="text"
        placeholder="Nombre del plan"
      />
      <div id="nombre-error" aria-live="polite" aria-atomic="true">
        {state.errors?.nombre &&
          state.errors.nombre.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
        ))}
      </div>

      <Card aria-describedby="materias-error">
        <CardContent className="p-4">
          {planSubjects.length > 0 ? (
            <ul className="space-y-2">
              {planSubjects
                .sort((a, b) => Number(a.año) - Number(b.año))
                .map(materiaPlan => (
                  <li key={materiaPlan.materia.codigo} className="flex justify-between items-center">
                    <span>{materiaPlan.materia.codigo} - {materiaPlan.materia.nombre} - Año {materiaPlan.año}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeSubject(materiaPlan.materia.codigo)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No se han agregado materias todavía</p>
          )}
        </CardContent>
      </Card>
      <div id="materias-error" aria-live="polite" aria-atomic="true">
        {state.errors?.materias &&
          state.errors.materias.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
        ))}
      </div>

      <div className="flex justify-between">
        <Link href='/gestion-planes' className="w-full">
          <Button type="button" variant="outline">Cancelar</Button>
        </Link>
        <Button type="submit">Guardar Plan</Button>
      </div>
    </form>
  )
}
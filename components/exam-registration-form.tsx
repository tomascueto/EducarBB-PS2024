"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import  Link  from "next/link"
import { useFormState } from 'react-dom';
import { crearExamen } from '@/lib/actions';
import { ExamenState, Usuario } from "@/lib/definitions"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ExamListProps {
  aulaId: string;
  alumnos: Usuario[];
}

export default function RegistrationForm({ aulaId, alumnos }: ExamListProps) {
  const [alumnosExamen, setAlumnosExamen] = useState<Array<{alumno: Usuario, nota: string}>>(
    alumnos.map(alumno => ({ alumno, nota: '' }))
  )

  const initialState : ExamenState = { message: "", errors: {} };
  const [state, formAction] = useFormState<ExamenState, FormData>(async (state, formData) => {
    
    return await crearExamen(state, formData);
  }, initialState);
  
  return (
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div>
                <Label htmlFor="codigo" className="block mb-2">Código</Label>
                <Input
                  id="codigo"
                  name="codigo"
                  className="w-full"
                  aria-describedby="codigo-error"
                />
               </div>
               <div id="codigo-error" aria-live="polite" aria-atomic="true">
                {state.errors?.codigo &&
                  state.errors.codigo.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>

              <div>
                <Label htmlFor="fecha" className="block mb-2">Fecha</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  className="w-full"
                  aria-describedby="fecha-error"
                />
               </div>
              <div id="fecha-error" aria-live="polite" aria-atomic="true">
                {state.errors?.fecha &&
                  state.errors.fecha.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>
            </div>
          </div>

          <Card aria-describedby="alumnos-error">
            <CardContent className="p-4">
              {alumnosExamen.length > 0 ? (
                <ul className="space-y-2">
                  {alumnosExamen
                    .sort((a, b) => Number(a.alumno.nombres) - Number(b.alumno.nombres))
                    .map(alumnoExamen => (
                      <li key={alumnoExamen.alumno.dni} className="flex justify-between items-center">
                        <span>{alumnoExamen.alumno.dni} - {alumnoExamen.alumno.nombres}</span>
                        <Input id="nota" placeholder="Ingresar nota" defaultValue={alumnoExamen.nota} name="nota" className="ml-auto w-30"/> 
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No se han agregado alumnos al aula todavía</p>
              )}
            </CardContent>
          </Card>
          <div id="alumnos-error" aria-live="polite" aria-atomic="true">
            {state.errors?.alumnos &&
              state.errors.alumnos.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
            ))}
          </div>
          
          <div className="flex justify-between pt-4">
            <Link href={`/gestion-aulas/${aulaId}/examenes`} className="w-1/3">
              <Button type="button" variant="outline" className="w-1/3">Cancelar</Button>
            </Link>
            
            <Button type="submit" className="w-1/3">Guardar Exámen</Button>
          </div>
        </form>
  )
}
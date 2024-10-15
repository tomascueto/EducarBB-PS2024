"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import  Link  from "next/link"
import { useFormState } from 'react-dom';
import { crearMateria } from '@/lib/actions';
import { MateriaState } from "@/lib/definitions"
import { useState } from "react"
import { Upload } from 'lucide-react'

export default function SubjectRegistrationForm() {

  const initialState : MateriaState = { message: "", errors: {} };
  const [state, formAction] = useFormState<MateriaState, FormData>(async (state, formData) => {
    await crearMateria(state, formData);
    return state;
  }, initialState);
  const [file, setFile] = useState<File | null>(null)
  
  return (
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block mb-2">Nombre</Label>
                <Input id="nombre" name="nombre" className="w-full" aria-describedby="nombre-error"/> 
              </div>           
              <div id="nombre-error" aria-live="polite" aria-atomic="true">
                {state.errors?.nombre &&
                  state.errors.nombre.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>

              <div>
                <Label htmlFor="codigo" className="block mb-2">Código</Label>
                <Input id="codigo" name="codigo" className="w-full" aria-describedby="dni-error"/>
              </div>
              <div id="codigo-error" aria-live="polite" aria-atomic="true">
                {state.errors?.codigo &&
                  state.errors.codigo.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium">Plan de la materia</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".pdf"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file')?.click()}
                    className="px-4 py-2 border rounded-md flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Examinar
                  </Button>
                  <span className="text-sm text-gray-500">
                    {file ? file.name : 'Ningún archivo seleccionado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Link href="/gestion-materias" className="w-1/3">
              <Button type="button" variant="outline" className="w-1/3">Cancelar</Button>
            </Link>
            
            <Button type="submit" className="w-1/3">Guardar Materia</Button>
          </div>
        </form>
  )
}
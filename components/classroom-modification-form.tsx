"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import  Link  from "next/link"
import { useFormState } from 'react-dom';
import { modificarAula } from '@/lib/actions';
import { Aula, AulaState, Usuario } from "@/lib/definitions"
import { useState } from "react"
import { X } from "lucide-react"
import { Card, CardContent } from "./ui/card"


interface ClassroomListProps {
  aulaId: string;
    profesores: Usuario[];
    alumnos: Usuario[];
  }

// Get the current year
const currentYear = new Date().getFullYear().toString();

export default function ModificationForm({ aulaId, profesores, alumnos }: ClassroomListProps) {
  
    const [selectedProfesor, setSelectedProfesor] = useState('')
    const [selectedAlumno, setSelectedAlumno] = useState('')
    const [profesoresList, setProfesoresList] = useState<Array<Usuario>>([])
    const [alumnosList, setAlumnosList] = useState<Array<Usuario>>([])

    const initialState: AulaState = { errors: {}, message: "" };
    const [state, formAction] = useFormState<AulaState, FormData>(async (state, formData) => {
      
      // Append de id
      formData.append('id_aula', aulaId);

      // Append selected profesores
      profesoresList.forEach((profesor, index) => {
        formData.append(`profesores[${index}][dni]`, profesor.dni);
      });
  
      // Append selected alumnos
      alumnosList.forEach((alumno, index) => {
        formData.append(`alumnos[${index}][dni]`, alumno.dni);
      });
  
      // Call the action to create the classroom
      return await modificarAula(state, formData);
    }, initialState);
  
    const addProfesor = () => {
      if (selectedProfesor) {
        const profesor = profesores.find(p => p.dni === selectedProfesor)
        if (profesor) {
          setProfesoresList([...profesoresList, profesor])
          setSelectedProfesor('')
        }
      }
    }

    const removeProfesor = (dni: string) => {
      setProfesoresList(profesoresList.filter(p => p.dni !== dni))
    }
  
    
    const addAlumno = () => {
      if (selectedAlumno) {
        const alumno = alumnos.find(a => a.dni === selectedAlumno)
        if (alumno) {
          setAlumnosList([...alumnosList, alumno])
          setSelectedAlumno('')
        }}
    }
  
    const removeAlumno = (dni: string) => {
      setAlumnosList(alumnosList.filter(a => a.dni !== dni))
    }
  
    return (
      <form action={formAction} className="max-w-2xl mx-auto p-6 space-y-6">
                
        {/* Profesores */}
        <div className="flex space-x-4">
          <Select value={selectedProfesor} onValueChange={setSelectedProfesor}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Profesor" />
            </SelectTrigger>
            <SelectContent>
              {profesores.filter(profesor => !profesoresList.some(profesorLocal => profesorLocal.dni === profesor.dni))
                .map(prof => (
                  <SelectItem key={prof.dni} value={prof.dni}>{prof.dni} - {prof.nombres} {prof.apellido}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addProfesor} className="h-[38px]">
            +
          </Button>
        </div>
              
        {/* Display de profesores seleccionados */}
        <Card aria-describedby="profesores-error">
          <CardContent className="p-4">
            {profesoresList.length > 0 ? (
              <ul className="space-y-2">
                {profesoresList.map(prof => (
                  <li key={prof.dni} className="flex justify-between items-center">
                    <span>{prof.dni} - {prof.nombres} {prof.apellido}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeProfesor(prof.dni)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No se han agregado profesores todavía</p>
            )}
          </CardContent>
        </Card>


        {/* Alumnos */}
        <div className="flex space-x-4">
          <Select value={selectedAlumno} onValueChange={setSelectedAlumno}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Alumno" />
            </SelectTrigger>
            <SelectContent>
              {alumnos.filter(alumno => !alumnosList.some(alumnoLocal => alumnoLocal.dni === alumno.dni))
                .map(alum => (
                  <SelectItem key={alum.dni} value={alum.dni}>{alum.dni} - {alum.nombres} {alum.apellido}</SelectItem>
                ))}

            </SelectContent>
          </Select>
          <Button type="button" onClick={addAlumno} className="h-[38px]">
            +
          </Button>
        </div>
  
        {/* Display de Alumnos seleccionados */}
        <Card aria-describedby="alumnos-error">
          <CardContent className="p-4">
            {alumnosList.length > 0 ? (
              <ul className="space-y-2">
                {alumnosList.map(alum => (
                  <li key={alum.dni} className="flex justify-between items-center">
                    <span>{alum.dni} - {alum.nombres} {alum.apellido}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeAlumno(alum.dni)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No se han agregado alumnos todavía</p>
            )}
          </CardContent>
        </Card>
  
        {/* Buttons */}
        <div className="flex justify-between">
        <Link href="/gestion-aulas" className="w-full">
          <Button type="button" variant="outline">Cancelar</Button>
        </Link>
          <Button type="submit">Guardar Aula</Button>
        </div>
      </form>
  )
}
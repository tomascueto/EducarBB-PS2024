"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import  Link  from "next/link"
import { useFormState } from 'react-dom';
import { crearAula } from '@/lib/actions';
import { Aula, AulaState, Materia, Usuario } from "@/lib/definitions"
import { useState } from "react"
import { X } from "lucide-react"
import { Card, CardContent } from "./ui/card"


interface SubjectListProps {
    materias: Materia[];
    profesores: Usuario[];
    alumnos: Usuario[];
  }

// Get the current year
const currentYear = new Date().getFullYear().toString();

export default function RegistrationForm({ materias, profesores, alumnos }: SubjectListProps) {
  
    const [selectedMateria, setSelectedMateria] = useState('')
    const [selectedYear] = useState(currentYear) // Default to the current year, no need for setSelectedYear
    const [selectedTurno, setSelectedTurno] = useState('')
    const [selectedProfesores, setSelectedProfesores] = useState<Usuario[]>([])
    const [selectedAlumnos, setSelectedAlumnos] = useState<Usuario[]>([])
  
    const initialState: AulaState = { errors: {}, message: "" };
    const [state, formAction] = useFormState<AulaState, FormData>(async (state, formData) => {
      
      // Append the classroom data to FormData
      formData.append('materia', selectedMateria);
      formData.append('turno', selectedTurno);
      formData.append('año', selectedYear);
  
      // Append selected profesores
      selectedProfesores.forEach((profesor, index) => {
        formData.append(`profesores[${index}][dni]`, profesor.dni);
      });
  
      // Append selected alumnos
      selectedAlumnos.forEach((alumno, index) => {
        formData.append(`alumnos[${index}][dni]`, alumno.dni);
      });
  
      // Call the action to create the classroom
      return await crearAula(state, formData);
    }, initialState);
  
    const addProfesor = (dni: string) => {
      const profesor = profesores.find(p => p.dni === dni)
      if (profesor) {
        setSelectedProfesores([...selectedProfesores, profesor])
      }
    }
  
    const removeProfesor = (dni: string) => {
      setSelectedProfesores(selectedProfesores.filter(p => p.dni !== dni))
    }
  
    const addAlumno = (dni: string) => {
      const alumno = alumnos.find(a => a.dni === dni)
      if (alumno) {
        setSelectedAlumnos([...selectedAlumnos, alumno])
      }
    }
  
    const removeAlumno = (dni: string) => {
      setSelectedAlumnos(selectedAlumnos.filter(a => a.dni !== dni))
    }
  
    return (
      <form action={formAction} className="max-w-2xl mx-auto p-6 space-y-6">

        {/* Materia */}
        <div className="flex space-x-4">
          <Select value={selectedMateria} onValueChange={setSelectedMateria}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Materia" />
            </SelectTrigger>
            <SelectContent>
              {materias.map(materia => (
                <SelectItem key={materia.codigo} value={materia.codigo}>{materia.codigo} - {materia.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          {/* Año */}
          <Input
            id="año"
            name="año"
            type="text"
            value={currentYear}
            readOnly
            className="w-[100px]"
          />
  
          {/* Turno */}
          <Select value={selectedTurno} onValueChange={setSelectedTurno}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mañana">Mañana</SelectItem>
              <SelectItem value="tarde">Tarde</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        {/* Profesores */}
        <div className="flex space-x-4">
          <Select value={selectedProfesores[0]?.dni} onValueChange={dni => {
            const profesor = profesores.find(p => p.dni === dni);
            if (profesor) {
              setSelectedProfesores([profesor]);
            }
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Profesor" />
            </SelectTrigger>
            <SelectContent>
              {profesores.map(prof => (
                <SelectItem key={prof.dni} value={prof.dni}>{prof.dni} - {prof.nombres} {prof.apellido}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={() => addProfesor(selectedProfesores[0]?.dni)} className="h-[38px]">
            +
          </Button>
        </div>
              
        {/* Display de profesores seleccionados */}
        <Card aria-describedby="profesores-error">
          <CardContent className="p-4">
            {selectedProfesores.length > 0 ? (
              <ul className="space-y-2">
                {selectedProfesores.map(prof => (
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
          <Select value={selectedAlumnos[0]?.dni} onValueChange={dni => {
            const alumno = alumnos.find(a => a.dni === dni);
            if (alumno) {
              setSelectedAlumnos([alumno]);
            }
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Alumno" />
            </SelectTrigger>
            <SelectContent>
              {alumnos.map(alum => (
                <SelectItem key={alum.dni} value={alum.dni}>{alum.dni} - {alum.nombres} {alum.apellido}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={() => addAlumno(selectedAlumnos[0]?.dni)} className="h-[38px]">
            +
          </Button>
        </div>
  
        {/* Display de Alumnos seleccionados */}
        <Card aria-describedby="alumnos-error">
          <CardContent className="p-4">
            {selectedAlumnos.length > 0 ? (
              <ul className="space-y-2">
                {selectedAlumnos.map(alum => (
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
  
        {/* Errors and Message */}
        <div id="materia-error" aria-live="polite" aria-atomic="true">
          {state.errors?.materia && (
            <p className="mt-2 text-sm text-red-500" key="materia-error">
              {state.errors.materia.join(', ')}
            </p>
          )}
        </div>
  
        <div id="turno-error" aria-live="polite" aria-atomic="true">
          {state.errors?.turno && (
            <p className="mt-2 text-sm text-red-500" key="turno-error">
              {state.errors.turno.join(', ')}
            </p>
          )}
        </div>
  
        <div id="año-error" aria-live="polite" aria-atomic="true">
          {state.errors?.año && (
            <p className="mt-2 text-sm text-red-500" key="año-error">
              {state.errors.año.join(', ')}
            </p>
          )}
        </div>
  
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
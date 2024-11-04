"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useFormState } from 'react-dom';
import { actualizarExamen } from '@/lib/actions';
import { Examen, ExamenState, Usuario } from "@/lib/definitions"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ExamListProps {
  aulaId: string;
  existingExam: Examen;
}

export default function ModificationForm({ aulaId, existingExam }: ExamListProps) {
  const [alumnosExamen, setAlumnosExamen] = useState<Array<{ alumno: Usuario; nota: string }>>(
    existingExam.alumnos.map(alumno => ({ alumno: alumno.alumno, nota: alumno.nota }))
  );

  const initialState: ExamenState = { message: "", errors: {} };
  const [state, formAction] = useFormState<ExamenState, FormData>(async (state, formData) => {
    const newFormData = new FormData();

    const titulo = formData.get('titulo');
    const fecha = formData.get('fecha');

    if (titulo) {
      newFormData.append('titulo', titulo.toString());
    }

    if (fecha) {
      newFormData.append('fecha', fecha.toString());
    }

    alumnosExamen.forEach(({ alumno, nota }) => {
      if (alumno) {
        newFormData.append('alumnos[]', JSON.stringify({ alumno, nota }));
      }
    });

    return await actualizarExamen(state, newFormData, aulaId, existingExam.codigo);
  }, initialState);

  useEffect(() => {
    if (existingExam) {
      const { titulo, fecha } = existingExam;
      const tituloInput = document.getElementById('titulo') as HTMLInputElement;
      const fechaInput = document.getElementById('fecha') as HTMLInputElement;

      if (tituloInput) {
        tituloInput.value = titulo;
      }

      if (fechaInput) {
        fechaInput.value = fecha;
      }
    }
  }, [existingExam]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo" className="block mb-2">Nombre</Label>
            <Input
              id="titulo"
              name="titulo"
              className="w-full"
              aria-describedby="codigo-error"
            />
          </div>
          <div id="codigo-error" aria-live="polite" aria-atomic="true">
            {state.errors?.titulo &&
              state.errors.titulo.map((error: string) => (
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
                .sort((a, b) => a.alumno.nombres.localeCompare(b.alumno.nombres))
                .map((alumnoExamen, index) => (
                  <li key={alumnoExamen.alumno.dni} className="flex justify-between items-center">
                    <span>{alumnoExamen.alumno.dni} - {alumnoExamen.alumno.nombres}</span>
                    <Input
                      id={`nota-${index}`}
                      placeholder="Ingresar nota"
                      value={alumnoExamen.nota}
                      onChange={(e) => {
                        const updatedAlumnos = [...alumnosExamen];
                        updatedAlumnos[index].nota = e.target.value;
                        setAlumnosExamen(updatedAlumnos);
                      }}
                      className="ml-auto w-30"
                    />
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

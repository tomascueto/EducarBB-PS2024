"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import  Link  from "next/link"
import { useFormState } from 'react-dom';
import { crearUsuario } from '@/lib/actions';
import { UsuarioState } from "@/lib/definitions"
export default function RegistrationForm() {

  const initialState : UsuarioState = { message: "", errors: {} };
  const [state, formAction] = useFormState(crearUsuario, initialState);
  
  return (
        <form action={formAction} className="space-y-6">
          <div className="w-2/3 mx-auto mb-6">
            <Label htmlFor="role" className="block text-center mb-2">Rol del Usuario</Label>
            <Select>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="guest">Invitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="block mb-2">Nombres</Label>
                <Input id="nombres" name="nombres" className="w-full" aria-describedby="nombres-error"/> 
              </div>           
              <div id="nombres-error" aria-live="polite" aria-atomic="true">
                {state.errors?.nombres &&
                  state.errors.nombres.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>

              <div>
                <Label htmlFor="apellido" className="block mb-2">Apellido</Label>
                <Input id="apellido" name="apellido" className="w-full" aria-describedby="apellido-error" />
              </div>
              <div id="apellido-error" aria-live="polite" aria-atomic="true">
                {state.errors?.apellido &&
                  state.errors.apellido.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>

              
              <div>
                <Label htmlFor="dni" className="block mb-2">DNI</Label>
                <Input id="dni" name="dni" className="w-full" aria-describedby="dni-error"/>
              </div>
              <div id="dni-error" aria-live="polite" aria-atomic="true">
                {state.errors?.dni &&
                  state.errors.dni.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>
              
              <div>
                <Label htmlFor="email" className="block mb-2">Email</Label>
                <Input id="email" name="email" type="email" className="w-full" aria-describedby="email-error"/>
              </div>

              <div id="email-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email &&
                  state.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col justify-center">

              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthDate" className="block mb-2">Fecha de nacimiento</Label>
                  <Input
                    id="fechanacimiento"
                    name="fechanacimiento"
                    type="date"
                    className="w-full"
                    aria-describedby="fechanacimiento-error"
                  />
                </div>

                <div id="fechanacimiento-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.fechanacimiento &&
                    state.errors.fechanacimiento.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                  ))}
                </div>

                <div>
                  <Label htmlFor="contrasenia" className="block mb-2">Contraseña</Label>
                  <Input id="contrasenia" name="contrasenia" type="text" className="w-full" aria-describedby="contraseña-error"/>
                </div>

                <div id="contraseña-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.contraseña &&
                    state.errors.contraseña.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                  ))}
                </div>

              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Link href="/gestion-usuarios" className="w-1/3">
              <Button type="button" variant="outline" className="w-1/3">Cancelar</Button>
            </Link>
            
            <Button type="submit" className="w-1/3">Guardar Usuario</Button>
          </div>
        </form>
  )
}
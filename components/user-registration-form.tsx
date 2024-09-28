"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    birthDate: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Aquí iría la lógica para enviar los datos al servidor
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Complete el siguiente formulario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-2/3 mx-auto mb-6">
            <Label htmlFor="role" className="block text-center mb-2">Rol del Usuario</Label>
            <Select onValueChange={handleRoleChange}>
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
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full" />
              </div>
              
              <div>
                <Label htmlFor="lastName" className="block mb-2">Apellido</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full" />
              </div>
              
              <div>
                <Label htmlFor="dni" className="block mb-2">DNI</Label>
                <Input id="dni" name="dni" value={formData.dni} onChange={handleInputChange} required className="w-full" />
              </div>
              
              <div>
                <Label htmlFor="email" className="block mb-2">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full" />
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <Label htmlFor="birthDate" className="block text-center mb-2">Fecha de nacimiento</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" className="w-1/3">Cancelar</Button>
            <Button type="submit" className="w-1/3">Guardar Usuario</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserModificationForm() {
  const [formData, setFormData] = useState({
    role: 'Admin',
    firstName: 'Jonh',
    lastName: 'Doe',
    dni: '12345678',
    email: 'john@example.com',
    birthDate: '29/9/2000' 
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="birthDate" className="block text-center mb-2">Fecha de nacimiento</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="text"
                  value={formData.birthDate}
                  readOnly
                  className="w-full"
                />
              </div>

              <div>
              <Label htmlFor="role" className="block text-center mb-2">Rol del Usuario</Label>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  readOnly
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" className="w-1/3">Cancelar</Button>
            <Button type="submit" className="w-1/3">Guardar Cambios</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
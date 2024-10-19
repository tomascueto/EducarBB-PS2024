"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import  RegistrationForm  from "@/components/classroom-registration-form"

export default function UserRegistrationForm() {

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Complete el siguiente formulario</CardTitle>
      </CardHeader>
      <CardContent>
        <RegistrationForm />
      </CardContent>
    </Card>
  )
}
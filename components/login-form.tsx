'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authenticate } from '@/lib/actions';
import Cookies from 'js-cookie';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null); 
  const passwordRef = useRef<HTMLInputElement | null>(null); 

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setIsLoading(true);
      setErrorMessage(null);

      const username = usernameRef.current?.value || '';
      const password = passwordRef.current?.value || '';
      
      console.log(username);
      console.log(password);

      const formData = new FormData();
      formData.append('email', username);
      formData.append('contrasenia', password);
  
      try {
        const response = await authenticate("", formData);
        if ('success' in response) {
          const { success, error } = response;
          console.log("La respuesta es", success);
          console.log("y con error", error);
          if (success) {
            const token = await response.data?.token ?? '';
            Cookies.set('authToken', token, {
              expires: 1, // 1 dia
              path: '/', //path desde donde se puede acceder (toda la app)
              secure: process.env.NODE_ENV === 'production',  // Secure in production
              httpOnly: false
          });
            window.location.href = '/home';
          } else {
            if (error !== undefined)
              setErrorMessage(typeof error === 'string' ? error : 'Hubo un error desconocido.');
          }
        } else {
          if ('error' in response) {
            console.log(response.error);
          }
          setErrorMessage('Hubo un error al autenticar.');
        }
      } catch (err) {
        console.log(err);
        setErrorMessage('Hubo un error al autenticar.');
      } finally {
        setIsLoading(false);
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    };
  
  return (
    <Card className="w-[350px] mx-auto my-10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-blue-500">EDUCAR BB</CardTitle>
        <CardDescription className='text-center font-'>
          Inicio Sesión
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="email" className="text-sm font-medium">
                  Email
              </Label>
              <Input
                id="username"
                type="text"
                ref={usernameRef}
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Contraseña
              </label>
              <Input
                id="password"
                type="password"
                ref={passwordRef}
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <Button type="submit"disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
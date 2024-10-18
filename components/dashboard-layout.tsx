'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Home, Calendar, LogOut } from 'lucide-react'
import Cookies from 'js-cookie'
import {jwtVerify} from 'jose';


async function fetchUserName(): Promise<string | null> {
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined');
  }

  const SECRET_KEY = new TextEncoder().encode(secretKey);
  const token = Cookies.get('authToken');
  
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.id as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchUserName().then(name => setUsername(name));
  }, []);



  const logout = () =>{
    Cookies.remove('authToken', {path: '/'});
    window.location.href = '/login';
  } 

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <span className="font-semibold">{username}</span>
          <div className="ml-8 flex items-center">
            <Link href="/home" className="flex items-center mr-4 hover:bg-accent rounded-md px-2 py-1">
              <Home className="h-4 w-4 mr-2" />
              <span>Home</span>
            </Link>
            <Link href="#" className="flex items-center hover:bg-accent rounded-md px-2 py-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Calendar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`flex flex-col border-r transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-0'
          }`}
        >
          {isSidebarOpen && (
            <>
              <ScrollArea className="flex-1">
                <nav className="space-y-2 p-4">
                  <Link href="/gestion-usuarios" className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-accent">
                    <span>Gestión Usuarios</span>
                  </Link>
                </nav>
                <nav className="space-y-2 p-4">
                  <Link href="/gestion-materias" className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-accent">
                    <span>Gestión Materias</span>
                  </Link>
                </nav>
                <nav className="space-y-2 p-4">
                  <Link href="/gestion-planes" className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-accent">
                    <span>Gestión Planes</span>
                  </Link>
                </nav>
                <nav className="space-y-2 p-4">
                  {['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5'].map((section, index) => (
                    <Link 
                      key={index} 
                      href="#" 
                      className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-accent"
                    >
                      <span>{section}</span>
                    </Link>
                  ))}
                </nav>
              </ScrollArea>
              <Button variant="ghost" className="m-4 flex items-center space-x-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </Button>
            </>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
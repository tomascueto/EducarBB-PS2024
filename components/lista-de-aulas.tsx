"use client"

import { Aula } from "@/lib/definitions";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { borrarAula } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ListaDeAulasProps {
    aulas: Aula[];
  }

export default function ListaDeAulas({ aulas }: ListaDeAulasProps) {

    const [searchTerm, setSearchTerm] = useState('')

    const filteredAulas = aulas.filter((aula) =>
      aula.materia.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const [deleteClassRoom, setDeleteClassRoom] = useState<Aula | null>(null);
  
    const handleDelete = async () => {
      if (deleteClassRoom) {
        await borrarAula(deleteClassRoom);
        setDeleteClassRoom(null);
      }
    };
    
    return (
    <>
        <div>Lista de Aulas</div>

        <div className="container mx-auto p-4">
            <div className="flex justify-between mb-4">
                <Input
                type="search"
                placeholder="Buscar plan"
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Link href="/gestion-aulas/crear">
                    <Button>Crear Nueva Aula</Button>
                </Link>
            </div>

            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Materia</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredAulas.map((aula) => (
                    <TableRow key={aula.codigo}>
                        <TableCell>{aula.codigo}</TableCell>
                        <TableCell>{aula.nombre}</TableCell>
                        <TableCell>{aula.materia}</TableCell>
                        <TableCell>{aula.turno}</TableCell>
                        <TableCell>{aula.año}</TableCell>
                        
                        <TableCell>

                        <Link href={`/gestion-aulas/${aula.codigo}`}>
                            <Button variant="ghost" size="sm">
                            Acceder
                            </Button>
                        </Link>

                        <Link href={`/gestion-aulas/${aula.codigo}/modificar`}>
                            <Button variant="ghost" size="sm">
                            Editar
                            </Button>
                        </Link>

                        <Button variant="ghost" size="icon" onClick={() => setDeleteClassRoom(aula)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>

                        <Dialog open={!!deleteClassRoom} onOpenChange={() => setDeleteClassRoom(null)}>
                            <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirma que desea eliminar del sistema este aula:</DialogTitle>
                                <DialogDescription className='text-center'>
                                {deleteClassRoom && (
                                    <>
                                    <p>Codigo: {deleteClassRoom.codigo}</p>
                                    </>
                                )}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteClassRoom(null)}>Cancelar</Button>
                                <Button variant="destructive" onClick={handleDelete}>Eliminar Aula</Button>
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </>
    )
}
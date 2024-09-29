const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';

export async function GET() {
    
    try {
        const queryText = `
        -- Asignar roles a los usuarios
        INSERT INTO Usuario_Rol (DNI, Rol) VALUES
        (12345678, 1),  -- Juan Carlos Pérez es Alumno
        (23456789, 3),  -- Ana María González es Docente
        (34567890, 5),  -- Pedro José Martínez es Administrador
        (45678901, 4),  -- Lucía Elena López es Directivo
        (56789012, 2);  -- Carlos Alberto Fernández es Padre
        `;
        await db.query(queryText);
        return NextResponse.json({ message: 'Tablas de roles seedeadas' });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return NextResponse.json({ error: 'Error al obtener roles' }, { status: 500 });
    } finally {
        await db.end();
    }

}

const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';



export async function GET() {
    
    try{
        const queryText = `
            CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            contraseña VARCHAR(100) NOT NULL
            );
        `;
        await db.query(queryText);
        return NextResponse.json({ message: 'Tabla usuarios creada con éxito' });
    } catch (error) {
        console.error('Error al crear la tabla usuarios:', error);
        return NextResponse.json({ error: 'Error al crear la tabla' }, { status: 500 });
    } finally {
        await db.end();
  }

}
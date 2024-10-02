const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';



export async function GET() {
    
    try{
        const queryText = `
            DROP TABLE IF EXISTS usuario_rol,roles,usuarios;
        `;
        await db.query(queryText);
        return NextResponse.json({ message: 'Tablas eliminadas' });
    } catch (error) {
        console.error('Error al eliminar las tablas', error);
        return NextResponse.json({ error: 'Error al eliminar la tabla' }, { status: 500 });
    } finally {
        await db.end();
  }

}
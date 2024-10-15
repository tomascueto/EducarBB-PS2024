const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';

export async function GET() {
    
    try {
        const queryText = `
        SELECT * FROM usuarios
        `;
        const res = await db.query(queryText);
        const roles = res.rows;
        return NextResponse.json({ roles });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return NextResponse.json({ error: 'Error al obtener roles' }, { status: 500 });
    } finally {
        await db.end();
    }

}


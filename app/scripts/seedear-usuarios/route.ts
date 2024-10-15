const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function GET() {
    console.log(crypto.hash('sha1','password123'));
    try {
        const queryText = `
        INSERT INTO Usuarios (DNI, Nombres, Apellido, email, Contraseña, FechaNacimiento) VALUES
        (12345678, 'Juan Carlos', 'Pérez', 'juan.perez@example.com', '${crypto.hash('sha256',('password123'))}', '1990-05-10'),
        (23456789, 'Ana María', 'González', 'ana.gonzalez@example.com', '${crypto.hash('sha256',('password456'))}', '1985-11-23'),
        (34567890, 'Pedro José', 'Martínez', 'pedro.martinez@example.com', '${crypto.hash('sha256',('password789'))}', '1992-08-15'),
        (45678901, 'Lucía Elena', 'López', 'lucia.lopez@example.com', '${crypto.hash('sha256',('password101'))}', '1988-03-30'),
        (56789012, 'Carlos Alberto', 'Fernández', 'carlos.fernandez@example.com', '${crypto.hash('sha256',('password202'))}', '1995-09-17');
        `;
        await db.query(queryText);
        return NextResponse.json({ message: 'Tabla de Usuario seedeada' });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return NextResponse.json({ error: 'Error al obtener roles' }, { status: 500 });
    } finally {
        await db.end();
    }

}

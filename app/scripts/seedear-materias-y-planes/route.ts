const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';



export async function GET() {
    
    try{
        const queryText = `
        -- Tabla Plan de Estudios
        CREATE TABLE Plan_de_Estudios (
            Plan_ID SERIAL PRIMARY KEY,
            Nombre VARCHAR(255) NOT NULL
        );

        -- Tabla Materia
        CREATE TABLE Materia (
            Codigo VARCHAR(50) PRIMARY KEY,
            Nombre VARCHAR(255) NOT NULL,
            plan_URL VARCHAR(255) -- Campo para la URL del plan de estudios, si es necesario.
        );

        -- Tabla Materia_Plan (tabla intermedia para la relación many-to-many)
        CREATE TABLE Materia_Plan (
            Plan_ID INT,
            Codigo VARCHAR(50),
            Año INT,
            PRIMARY KEY (Plan_ID, Codigo),
            FOREIGN KEY (Plan_ID) REFERENCES Plan_de_Estudios(Plan_ID) ON DELETE CASCADE,
            FOREIGN KEY (Codigo) REFERENCES Materia(Codigo)
        );
        `;
        await db.query(queryText);
        return NextResponse.json({ message: 'Tablas de materias y planes creadas' });
    } catch (error) {
        console.error('Error al crear la tabla materias:', error);
        return NextResponse.json({ error: 'Error al crear la tabla' }, { status: 500 });
    } finally {
        await db.end();
  }

}
const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';

export async function GET() {
    
    try{
        const queryText = `
        -- Tabla Examenes
        CREATE TABLE Examen (
            Examen_ID SERIAL PRIMARY KEY,
            Nombre VARCHAR(255) NOT NULL,
            Fecha DATE NOT NULL
        );

        -- Tabla Examen-Alumno
        CREATE TABLE Examen_Alumno (
            Examen_ID BIGINT NOT NULL,
            DNI BIGINT NOT NULL,
            Nota SMALLINT,
            Firma BOOLEAN NOT NULL DEFAULT FALSE,
            PRIMARY KEY (Examen_ID, DNI),
            FOREIGN KEY (Examen_ID) REFERENCES Examen(Examen_ID) ON DELETE CASCADE,
            FOREIGN KEY (DNI) REFERENCES Usuarios(DNI)
            );

        -- Tabla Examen-Aula
        CREATE TABLE Examen_Aula (
            Examen_ID BIGINT NOT NULL,
            Aula_ID BIGINT NOT NULL,
            PRIMARY KEY (Examen_ID, Aula_ID),
            FOREIGN KEY (Examen_ID) REFERENCES Examen(Examen_ID) ON DELETE CASCADE,
            FOREIGN KEY (Aula_ID) REFERENCES Aula(Aula_ID)
            );
        `;
        await db.query(queryText);
        return NextResponse.json({ message: 'Tablas de examenes y resultados examens creadas' });
    } catch (error) {
        console.error('Error al crear la tabla materias:', error);
        return NextResponse.json({ error: 'Error al crear la tabla' }, { status: 500 });
    } finally {
        await db.end();
  }
}

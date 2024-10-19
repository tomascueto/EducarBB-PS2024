const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';



export async function GET() {
    
    try{
        const queryText = `
        -- Tabla Aula
        CREATE TABLE Aula (
            Aula_ID SERIAL PRIMARY KEY,
            Codigo_Materia VARCHAR(50) NOT NULL,
            Nombre VARCHAR(255) NOT NULL,
            Año INT NOT NULL,
            Turno VARCHAR(50) CHECK (Turno IN ('Mañana', 'Tarde')) NOT NULL,
            FOREIGN KEY (Codigo_Materia) REFERENCES Materia(Codigo) ON DELETE RESTRICT
        );

        -- Tabla Aula_Usuario (asociación entre Aula y usuarios: profesores y alumnos)
        CREATE TABLE Aula_Usuario (
            Aula_ID INT,
            DNI BIGINT NOT NULL,
            PRIMARY KEY (Aula_ID, DNI),
            FOREIGN KEY (Aula_ID) REFERENCES Aula(Aula_ID) ON DELETE CASCADE,
            -- Asumiendo que hay una tabla Usuario que contiene la información de cada usuario (profesores y alumnos)
            FOREIGN KEY (DNI) REFERENCES Usuarios(DNI) ON DELETE CASCADE
        );
        `;
        await db.query(queryText);
        return NextResponse.json({ message: '' });
    } catch (error) {
        console.error('Error al crear la tabla aulas:', error);
        return NextResponse.json({ error: 'Error al crear la tabla' }, { status: 500 });
    } finally {
        await db.end();
  }

}
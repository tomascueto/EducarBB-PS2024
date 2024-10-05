const { db } = require('@vercel/postgres');
import { NextResponse } from 'next/server';



export async function GET() {
    
    try{
        const queryText = `
        -- Crear la tabla Roles
        CREATE TABLE Roles (
            ID SERIAL PRIMARY KEY,
            Nombre VARCHAR(50) NOT NULL
        );

        -- Insertar los roles mencionados en el diagrama
        INSERT INTO Roles (Nombre) VALUES 
        ('Alumno'),
        ('Padre'),
        ('Docente'),
        ('Directivo'),
        ('Administrador');

        -- Crear la tabla Usuarios
        CREATE TABLE Usuarios (
            DNI BIGINT PRIMARY KEY,
            Nombres VARCHAR(100) NOT NULL,
            Apellido VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            Contraseña VARCHAR(100) NOT NULL,
            FechaNacimiento DATE NOT NULL
        );

        -- Crear la tabla Usuario_Rol (relación muchos a muchos)
        CREATE TABLE Usuario_Rol (
            DNI BIGINT,
            Rol INT,
            PRIMARY KEY (DNI, Rol),
            FOREIGN KEY (DNI) REFERENCES Usuarios(DNI) ON DELETE CASCADE,
            FOREIGN KEY (Rol) REFERENCES Roles(ID) ON DELETE CASCADE
        );
        `;
        await db.query(queryText);
        return NextResponse.json({ message: 'Tabla de roles creada con éxito' });
    } catch (error) {
        console.error('Error al crear la tabla usuarios:', error);
        return NextResponse.json({ error: 'Error al crear la tabla' }, { status: 500 });
    } finally {
        await db.end();
  }

}
import { sql } from '@vercel/postgres';

import { 
  Aula,
  Materia,
  PlanEstudio,
  Usuario
  //Acá importar los tipos.
 } from './definitions';

import { unstable_noStore as noStore } from 'next/cache';

export async function fetchUsuarios() {
    noStore();
    try{
      const user = await sql<Usuario>`SELECT * FROM usuarios`;

      return user.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch brands user.');
    }
}

export async function fetchAlumnos(){
    noStore();
    try{
      const user = await sql<Usuario>`SELECT 
                                          u.DNI,
                                          u.Nombres,
                                          u.Apellido,
                                          u.email,
                                          u.Contraseña,
                                          u.FechaNacimiento,
                                          r.Nombre AS Rol
                                      FROM 
                                          Usuarios u
                                      JOIN 
                                          Usuario_Rol ur ON u.DNI = ur.DNI
                                      JOIN 
                                          Roles r ON ur.Rol = r.ID
                                      WHERE
                                          r.Nombre = 'Alumno';
      `;
      return user.rows;
    } catch (error) { 
      console.error('Database Error:', error);
      throw new Error('Error al obtener Alumnos.');
    }
}

export async function fetchProfesores(){
    noStore();
    try{
      const user = await sql<Usuario>`SELECT 
                                          u.DNI,
                                          u.Nombres,
                                          u.Apellido,
                                          u.email,
                                          u.Contraseña,
                                          u.FechaNacimiento,
                                          r.Nombre AS Rol
                                      FROM 
                                          Usuarios u
                                      JOIN 
                                          Usuario_Rol ur ON u.DNI = ur.DNI
                                      JOIN 
                                          Roles r ON ur.Rol = r.ID
                                      WHERE
                                          r.Nombre = 'Docente';
      `;
      return user.rows;
    } catch (error) { 
      console.error('Database Error:', error);
      throw new Error('Error al obtener Profesores.');
    }
}

export async function fetchUsuariosConRoles() {
    noStore();
    try{
      const user = await sql<Usuario>`SELECT 
                                          u.DNI,
                                          u.Nombres,
                                          u.Apellido,
                                          u.email,
                                          u.Contraseña,
                                          u.FechaNacimiento,
                                          r.Nombre AS Rol
                                      FROM 
                                          Usuarios u
                                      JOIN 
                                          Usuario_Rol ur ON u.DNI = ur.DNI
                                      JOIN 
                                          Roles r ON ur.Rol = r.ID;
`;

      return user.rows;
    } catch (error) { 
      console.error('Database Error:', error);
      throw new Error('Failed to fetch brands user.');
    }
}

export async function fetchUsuarioPorDni(dni: string) {
    noStore();
    try {
      const user = await sql<Usuario>`SELECT dni, nombres, apellido, email, TO_CHAR(fechanacimiento, 'YYYY-MM-DD') as fechanacimiento FROM usuarios WHERE dni = ${dni}`
    
      if (user.rows.length === 0) {
        throw new Error(`No se encontró usuario con DNI: ${dni}`);
      }

      return user.rows[0];
    } catch (error) {
      console.error('Database Error:', error)
      throw new Error('Failed to fetch user')
    }
}

export async function fetchUsuarioConRolPorDni(dni: string) {
  noStore();
  try {
    const user = await sql<Usuario>`SELECT
                                      u.DNI,
                                      u.Nombres,
                                      u.Apellido,
                                      u.email,
                                      u.Contraseña,
                                      TO_CHAR(fechanacimiento, 'YYYY-MM-DD') as fechanacimiento,
                                      r.Nombre AS Rol
                                    FROM
                                      Usuarios u
                                    JOIN
                                      Usuario_Rol ur ON u.DNI = ur.DNI
                                    JOIN
                                      Roles r ON ur.Rol = r.ID
                                    WHERE
                                      u.DNI = ${dni}`;
    if (user.rows.length === 0) {
      throw new Error(`No se encontró usuario con DNI: ${dni}`);
    }
    return user.rows[0];
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch user')
  }
}

export async function fetchRoles() {
  noStore();
  try {
    const roles = await sql`SELECT * FROM roles`;
    return roles.rows;
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch roles')
  }
}

export async function fetchMaterias() {
  noStore();
  try {
    const materias = await sql<Materia>`SELECT * FROM Materia`;
    return materias.rows;
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch materias')
  }
}

export async function fetchPlanes() {
  noStore();
  try {
      const planes = await sql<PlanEstudio>`SELECT * FROM Plan_de_Estudios`;
      return planes.rows;
  } catch (error) {
      console.error('Database Error:', error)
      throw new Error('Failed to fetch planes')
  }
}

export async function fetchAulas() {
  noStore();
  try {
      const aulas = await sql<Aula>`SELECT 
                                        a.Aula_ID as codigo,
                                        a.nombre,
                                        m.nombre as materia,
                                        a.turno,
                                        a.año
                                    FROM Aula a
                                    JOIN Materia m ON a.Codigo_Materia = m.Codigo;`;
      return aulas.rows;
  } catch (error) {
      console.error('Database Error:', error)
      throw new Error('Failed to fetch aulas')
  }
}
import { sql } from '@vercel/postgres';

import { 
  Aula,
  Examen,
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

export async function fetchAulaById(aulaId: string) {
  noStore();
  try {
      const result = await sql<Aula>`SELECT 
                                      a.Aula_ID as codigo,
                                      a.nombre,
                                      m.nombre as materia,
                                      a.turno,
                                      a.año
                                  FROM Aula a
                                  JOIN Materia m ON a.Codigo_Materia = m.Codigo
                                  WHERE a.Aula_ID = ${aulaId};`;
      const aula: Aula = result.rows[0];

      const resultProfesores = await sql<Usuario>`SELECT
                                                      u.DNI,
                                                      u.Nombres,
                                                      u.Apellido
                                                  FROM
                                                      Usuarios u
                                                  JOIN
                                                      Usuario_Rol ur ON u.DNI = ur.DNI
                                                  JOIN
                                                      Roles r ON ur.Rol = r.ID
                                                  JOIN
                                                      Aula_Usuario au ON u.DNI = au.DNI
                                                  WHERE
                                                      au.Aula_ID = ${aulaId} AND r.Nombre = 'Docente';`;
      
      const resultAlumnos = await sql<Usuario>`SELECT
                                                    u.DNI,
                                                    u.Nombres,
                                                    u.Apellido
                                                FROM
                                                    Usuarios u
                                                JOIN
                                                    Usuario_Rol ur ON u.DNI = ur.DNI
                                                JOIN
                                                    Roles r ON ur.Rol = r.ID
                                                JOIN
                                                    Aula_Usuario au ON u.DNI = au.DNI
                                                WHERE
                                                    au.Aula_ID = ${aulaId} AND r.Nombre = 'Alumno';`;
      aula.profesores = resultProfesores.rows;
      aula.alumnos = resultAlumnos.rows;

      return aula;
  } catch (error) {
      console.error('Database Error:', error)
      throw new Error('Failed to fetch aula')
  }
}

export async function fetchAulasByStudent(dni: string) {
  noStore();
  try {
      const aulas = await sql<Aula>`SELECT 
                                      a.Aula_ID as codigo,
                                      a.nombre,
                                      m.nombre as materia,
                                      a.turno,
                                      a.año
                                  FROM Aula a
                                  JOIN Aula_Usuario au ON a.Aula_ID = au.Aula_ID
                                  JOIN Materia m ON a.Codigo_Materia = m.Codigo 
                                  WHERE au.DNI = ${dni}
                                  ORDER BY a.año DESC;`;
        return aulas.rows;
  } catch (error) {
      console.error('Database Error:', error)
      throw new Error('Failed to fetch aulas')
  }
}


export async function fetchExamenes(aulaId: string) {
  noStore();
  try {
      const examenes = await sql<Examen>`
          SELECT 
              e.Examen_ID as codigo,
              e.Nombre as titulo,
              TO_CHAR(e.Fecha,'YYYY-MM-DD') as fecha
          FROM Examen e
          JOIN Examen_Aula ea ON e.Examen_ID = ea.Examen_ID
          WHERE ea.Aula_ID = ${aulaId}
      ;`;
      return examenes.rows;
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch examenes');
  }
}

export async function fetchExamenById(codigo: string) {
  noStore();
  try {
      const examen = await sql<Examen>`
          SELECT
              e.Examen_ID as codigo,
              e.Nombre as titulo,
              TO_CHAR(e.Fecha,'YYYY-MM-DD') as fecha
          FROM Examen e
          WHERE e.Examen_ID = ${codigo}
      ;`;

/*       const alumnos = await sql<{ alumno: Usuario; nota: string; }>` 
    SELECT json_agg(
              json_build_object(
                  'dni', u.DNI,
                  'nombres', u.Nombres,
                  'apellido', u.Apellido,
                  'nota', ea.nota
              )
          ) as alumnos
    FROM Examen_Alumno ea
    JOIN Usuarios u ON ea.DNI = u.DNI
    WHERE ea.Examen_ID = ${codigo}
;`;

      examen.rows[0].alumnos = alumnos.rows; */
      return examen.rows[0];
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch examenes');
  }
}

export async function fetchAlumnosFromExamId(codigo: string) {
  noStore();
  try {
      const resultExamen = await sql<{
          alumno: { dni: string; nombres: string; apellido: string, email: string, contraseña: string, fechanacimiento: string, rol: string };
          nota: string;
      }>`
          SELECT 
              json_build_object(
                  'dni', u.DNI,
                  'nombres', u.Nombres,
                  'apellido', u.Apellido,
                  'email', '',
                  'contraseña', '',
                  'fechaNacimiento', '',
                  'rol', ''
              ) AS alumno,
              ea.nota
          FROM Examen_Alumno ea
          JOIN Usuarios u ON ea.DNI = u.DNI
          WHERE ea.Examen_ID = ${codigo}
      ;`;

      // Access the rows from the result
      const alumnos = resultExamen.rows;

      // Log the alumnos to verify structure
      console.log('Alumnos:', alumnos);

      return alumnos;
  } catch (error) {
      console.error('Database Error:', error);
      if (error instanceof Error) {
          console.error('Error Message:', error.message);
      }
      throw new Error('Failed to fetch alumnos for the exam');
  }
}

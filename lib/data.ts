import { sql } from '@vercel/postgres';

import { 
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

export async function fetchUsuarioPorDni(dni: string) {
  try {
    const user = await sql<Usuario>`SELECT dni, nombres, apellido, email, TO_CHAR(fechanacimiento, 'DD/MM/YYYY') as fechanacimiento FROM usuarios WHERE dni = ${dni}`
   
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
  try {
    const roles = await sql`SELECT * FROM roles`;
    return roles.rows;
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch roles')
  }
}
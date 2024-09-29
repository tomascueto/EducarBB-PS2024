import { sql } from '@vercel/postgres';

import { 
  Usuario
  //Acá importar los tipos.
 } from './definitions';

import { unstable_noStore as noStore } from 'next/cache';

export async function fetchUsuarios() {
    noStore();
    try{
      const data = await sql<Usuario>`SELECT * FROM usuarios`;
      return data.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch brands data.');
    }
}
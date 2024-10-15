'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Usuario, UsuarioState, AuthError } from './definitions';
import crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';


const CrearUsuarioFormSchema = z.object({
    dni: z.string({
        invalid_type_error: 'Poner un dni'
    }).min(1,{message: 'Poner una dni'}),
    nombres: z.string({
        invalid_type_error: 'Poner un nombre'
    }).min(1,{message: 'Poner una categoría'}),
    apellido: z.string({
        invalid_type_error: 'Poner un apellido'
    }).min(1,{message: 'Poner una apellido'}),
    email: z.string({
        invalid_type_error: 'Poner un email'
    }).min(1,{message: 'Poner una email'}),
    contraseña: z.string({
        invalid_type_error: 'Poner una contraseña'
    }).min(1,{message: 'Poner una contraseña'}),
    fechanacimiento: z.string({
        invalid_type_error: 'Poner una fecha de nacimiento'
    }).min(1,{message: 'Poner una fecha de nacimiento'}),
    rol: z.string({
        invalid_type_error: 'Poner un rol'
    }).min(1,{message: 'Poner un rol'})
});

const ModificarUsuarioFormSchema = z.object({
    prevDni: z.string(),
    dni: z.string({
        invalid_type_error: 'Poner un dni'
    }).min(1,{message: 'Poner un dni'}),
    nombres: z.string({
        invalid_type_error: 'Poner un nombre'
    }).min(1,{message: 'Poner un nombre'}),
    apellido: z.string({
        invalid_type_error: 'Poner un apellido'
    }).min(1,{message: 'Poner un apellido'}),
    email: z.string({
        invalid_type_error: 'Poner un email'
    }).min(1,{message: 'Poner un email'}),
    contraseña: z.string().optional()
});

const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    contraseña: z.string().min(1, { message: 'Password is required' }),
});

export async function crearUsuario(prevState: UsuarioState, formData: FormData){

    console.log(formData);

    const validatedFields = CrearUsuarioFormSchema.safeParse({
        dni: formData.get('dni'),
        nombres: formData.get('nombres'),
        apellido: formData.get('apellido'),
        email: formData.get('email'),
        contraseña: formData.get('contrasenia'),
        fechanacimiento: formData.get('fechanacimiento'),
        rol: formData.get('rol')
    });

    console.log(validatedFields);

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Error al crear el usuario. Error en los campos.',
        };
    }

    const { 
        dni,
        nombres,
        apellido, 
        email, 
        contraseña,
        fechanacimiento,
        rol
    } = validatedFields.data;
    const contraseñaHasheada = crypto.hash('sha256',contraseña); 

    try {
        await sql`
        INSERT INTO usuarios (dni, nombres, apellido, email, contraseña, fechanacimiento)
        VALUES (${dni}, ${nombres}, ${apellido}, ${email}, ${contraseñaHasheada}, ${fechanacimiento});
        `;

        await sql`
        INSERT INTO Usuario_Rol (DNI, Rol) values (${dni}, ${rol});
        `;
        
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Error en la base de datos: error al crear un usuario.',
        };
    }
    revalidatePath('/');
    redirect('/gestion-usuarios');
}


export async function modificarUsuario(prevState: UsuarioState, formData: FormData) {

    const validatedFields = ModificarUsuarioFormSchema.safeParse({
        prevDni: formData.get('prevDni'),
        dni: formData.get('dni'),
        nombres: formData.get('nombres'),
        apellido: formData.get('apellido'),
        email: formData.get('email'),
        contraseña: formData.get('contrasenia')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error en los campos al modificar el usuario.',
        };
    }

    const { 
        prevDni,
        dni,
        nombres,
        apellido, 
        email, 
        contraseña
    } = validatedFields.data;

    // Si hay una nueva contraseña, se encripta antes de guardar
    let contraseñaHasheada
    if (contraseña) {
       contraseñaHasheada = crypto.hash('sha256',contraseña);
    }

    try {
        if (contraseña) {
            await sql`
              UPDATE usuarios
              SET 
                dni = ${dni}, 
                nombres = ${nombres}, 
                apellido = ${apellido},
                email = ${email}, 
                contraseña = ${contraseñaHasheada}
              WHERE dni = ${prevDni}
            `
          } else {
            await sql`
              UPDATE usuarios
              SET 
                dni = ${dni}, 
                nombres = ${nombres}, 
                apellido = ${apellido},
                email = ${email}
              WHERE dni = ${prevDni}
            `
          }
      
          if (prevDni !== dni) {
            // Si el DNI ha cambiado, actualiza cualquier referencia en otras tablas
          }

    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Error en la base de datos: error al modificar el usuario.',
        };
    }

    revalidatePath('/gestion-usuarios');
    redirect('/gestion-usuarios');
}


export async function borrarUsuario(user: Usuario) {
    try {
        await sql`
        DELETE FROM usuarios WHERE dni = ${user.dni}
        `;

    } catch (error) {
        return {
            message: 'Database Error: No se pudo borrar el usuario',
        };
    }
    revalidatePath('/gestion-usuarios');
    redirect('/gestion-usuarios');
}


export async function authenticate(prevState: string | undefined, formData: FormData) {

    const validatedFields = LoginSchema.safeParse(
        {
            email: formData.get('email'),
            contraseña: formData.get('contrasenia')
        }
    );
    
    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.flatten().fieldErrors };
    }
    
    const { email, contraseña } = validatedFields.data;
    const contraseñaHasheada = crypto.hash('sha256', contraseña);
    
    try {
        const result = await sql`
            SELECT * FROM usuarios WHERE email = ${email}
        `;
    
        if (result.rowCount === 0) {
            return { success: false, error: 'Credenciales incorrectas' };
        }
    
        const usuario = {
            dni: result.rows[0].dni,
            nombres: result.rows[0].nombres,
            email: result.rows[0].email,
            contraseña: result.rows[0].contraseña,
        };
    
        if (contraseñaHasheada === usuario.contraseña) {
            const rol_result = await sql`
                SELECT * FROM usuario_rol ur
                JOIN Roles r ON ur.rol = r.id
                WHERE dni = ${usuario.dni}
            `;
            const rol = {
                dni: rol_result.rows[0].dni,
                nombre: rol_result.rows[0].nombre,
            };
            const sessionToken = generarJWT({ id: usuario.nombres, rol: rol.nombre });
    
            
            const responseData = {
                success: true,
                usuario: usuario.nombres,
                rol: rol.nombre,
                token: sessionToken,
            };
    
            return {success: true, data:responseData};
        } else {
            return { success: false, error: 'Contraseña incorrecta' };
        }
    } catch (error) {
        return { error: 'Hubo un error durante la autenticación en SQL' };
    }
}
    
function generarJWT(user: { id: string, rol: string }) {
    const payload = {
        id: user.id,
        rol: user.rol,
    };

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    const signer = new SignJWT(payload).setIssuedAt().setExpirationTime('1h').setProtectedHeader({ alg: 'HS256' });
    return signer.sign(new TextEncoder().encode(process.env.JWT_SECRET));}
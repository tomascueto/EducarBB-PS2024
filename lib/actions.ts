'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Usuario, UsuarioState } from './definitions';
import crypto from 'node:crypto';


const UsuarioFormSchema = z.object({
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
    
});

const UsuarioUpdateFormSchema = z.object({
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

export async function crearUsuario(prevState: UsuarioState, formData: FormData){

    console.log(formData);

    const validatedFields = UsuarioFormSchema.safeParse({
        dni: formData.get('dni'),
        nombres: formData.get('nombres'),
        apellido: formData.get('apellido'),
        email: formData.get('email'),
        contraseña: formData.get('contrasenia'),
        fechanacimiento: formData.get('fechanacimiento')
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
        fechanacimiento
    } = validatedFields.data;
    console.log(contraseña);
    // const contraseñaHasheada = crypto.hash('sha1',contraseña);         NO ME FUNCA
    const contraseñaHasheada = crypto.createHash('sha256').update(contraseña).digest('hex'); 
    console.log(contraseñaHasheada);

    try {
        await sql`
        INSERT INTO usuarios (dni, nombres, apellido, email, contraseña, fechanacimiento)
        VALUES (${dni}, ${nombres}, ${apellido}, ${email}, ${contraseñaHasheada}, ${fechanacimiento});
        `;
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Error en la base de datos: error al crear un usuario.',
        };
    }
    revalidatePath('/');
    redirect('/');
}


export async function modificarUsuario(prevState: UsuarioState, formData: FormData) {

    const validatedFields = UsuarioUpdateFormSchema.safeParse({
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
       contraseñaHasheada = crypto.createHash('sha256').update(contraseña).digest('hex');
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
                contraseña = ${contraseña}
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







/*
export async function updateProduct(id:string, prevState : State,formData : FormData){
   
    const validatedFields = UpdateProduct.safeParse({
        productName: formData.get('productName'),
        price: formData.get('price'),
        brandName: formData.get('brandName'),
        categoryName: formData.get('categoryName'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Product.',
        };
    }

    const { 
        productName,
        price, 
        brandName, 
        categoryName, 
        description
    } = validatedFields.data;

    try{
        await sql`
        UPDATE products
        SET name = ${productName}, price = ${price}, brand_name = ${brandName}, category_name = ${categoryName}, description = ${description}
        WHERE id = ${id}
      `;

    }catch(error){
        return {
            message: 'Database Error: Failed to Update product'
        }
    } 

    revalidatePath('/admin/products');
    redirect('/admin/products')

}

export async function deleteProduct(id: string, cloudinary_public_id:string) {

    try{
        const result = await cloudinary.uploader.destroy(cloudinary_public_id);
        console.log('Imagen eliminada exitosamente:', result);
        await sql`DELETE FROM products WHERE id = ${id}`;
        revalidatePath('/admin/products');
        return { message: 'Deleted product.' };
    }catch(error){
        return {
            message: 'Database Error: Failed to delete Invoice.',
        };
    }
}

*/


/*
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      console.log("Se ejecuta authenticate luego de presionar el boton log in");
      console.log("Email que ingresa:"+formData.get('email'));
      console.log("Password que ingresa:"+formData.get('password'));
      await signIn('credentials',{
        ...Object.fromEntries(formData),
        redirectTo: "/admin"
      });
    } 
    catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'El email o contraseña son incorrectos.';
        }
      }
      throw error;
    }
}


export async function logOut() {
    try{
        await signOut({redirectTo : '/'})
    }
    catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
            case 'CredentialsSignin':
                return 'Invalid credentials.';
            default:
                return 'Something went wrong.';
            }
        }
        throw error;
    }
}



*/

'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Usuario, UsuarioState, AuthError, Materia, MateriaState, PlanEstudioState, PlanEstudio, Aula, AulaState, UsuarioModificationState } from './definitions';
import crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

const currentYear = new Date().getFullYear().toString();

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
    fechanacimiento: z.string({
        invalid_type_error: 'Poner una fecha de nacimiento'
    }).min(1,{message: 'Poner una fecha de nacimiento'}),
    contraseña: z.string().optional()
});

const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    contraseña: z.string().min(1, { message: 'Password is required' }),
});

// USUARIOS
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


export async function modificarUsuario(prevState: UsuarioModificationState, formData: FormData) {

    const validatedFields = ModificarUsuarioFormSchema.safeParse({
        prevDni: formData.get('prevDni'),
        dni: formData.get('dni'),
        nombres: formData.get('nombres'),
        apellido: formData.get('apellido'),
        email: formData.get('email'),
        fechanacimiento: formData.get('fechanacimiento'),
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
        fechanacimiento,
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
                fechanacimiento = ${fechanacimiento},
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
                email = ${email},
                fechanacimiento = ${fechanacimiento}
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


// AUTENTICACIÓN
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
    //const contraseñaHasheada = crypto.hash('sha256', contraseña);
    const contraseñaHasheada = crypto.createHash('sha256').update(contraseña).digest('hex');
    
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
    return signer.sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

// MATERIAS
const MateriaSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'Poner un nombre'
    }).min(1,{message: 'Poner un nombre'}),
    codigo: z.string({
        invalid_type_error: 'Poner un código'
    }).min(1,{message: 'Poner un código'}),
    // plan: z.string({
    //     invalid_type_error: 'Poner un plan'
    // }).min(1,{message: 'Poner una plan'}),
});

export async function crearMateria(prevState: MateriaState, formData: FormData){

    console.log(formData);

    const validatedFields = MateriaSchema.safeParse({
        codigo: formData.get('codigo'),
        nombre: formData.get('nombre'),
        //plan: formData.get('plan'),
    });

    console.log(validatedFields);

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Error al crear la materias. Error en los campos.',
        };
    }

    const { 
        codigo,
        nombre,
        // plan
    } = validatedFields.data;

    try {
        await sql`
        INSERT INTO Materia (codigo, nombre)
        VALUES (${codigo}, ${nombre});
        `;
        
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Error en la base de datos: error al crear una materia.',
        };
    }
    revalidatePath('/');
    redirect('/gestion-materias');
}


export async function borrarMateria(materia: Materia) {
    try {
        await sql`
        DELETE FROM Materia WHERE codigo = ${materia.codigo}
        `;

    } catch (error) {
        return {
            message: 'Database Error: No se pudo borrar la materia',
        };
    }
    revalidatePath('/gestion-materias');
    redirect('/gestion-materias');
}

// PLANES DE ESTUDIO
const Materia_PlanSchema = z.object({
    codigo: z.string({
        invalid_type_error: 'Colocar al menos una materia'
    }).min(1,{message: 'Poner una materia'}),
    año: z.string().regex(/^[1-5]$/, "El año debe estar entre 1 y 5"),
  });

const CrearPlanFormSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre del plan es requerido'
    }).min(1, {message: "El nombre del plan es requerido"}),
    materias: z.array(Materia_PlanSchema, {
        invalid_type_error: 'Debe seleccionar al menos una materia'
    }).nonempty("Debe seleccionar al menos una materia"),
  });

export async function crearPlan(prevState: PlanEstudioState, formData: FormData){

    console.log(formData);
    

    const materias: Array<{ codigo: string; año: string }> = [];
  
    let index = 0;
    while (formData.get(`materias[${index}][codigo]`)) {
      materias.push({
        codigo: formData.get(`materias[${index}][codigo]`) as string,
        año: formData.get(`materias[${index}][year]`) as string,
      });
      index++;
    }

    const validatedFields = CrearPlanFormSchema.safeParse({
        nombre: formData.get('nombre'),
        materias,
    });

    console.log("validatedFields "+JSON.stringify(validatedFields));

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Error al crear el plan de estudio. Error en los campos.',
        };
    }

    const { 
        nombre,
        materias: validatedMaterias
    } = validatedFields.data;

    try {
        const result = await sql`
        INSERT INTO Plan_de_Estudios (nombre)
        VALUES (${nombre})
        RETURNING Plan_ID;
        `;

        const planId = result.rows[0].plan_id;

        for (const materia of validatedMaterias) {
            await sql`
            INSERT INTO Materia_Plan (Plan_ID, Codigo, Año) values (${planId}, ${materia.codigo}, ${materia.año});
            `;
        }
        
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Error en la base de datos: error al crear un plan de estudio.',
        };
    }
    revalidatePath('/');
    redirect('/gestion-planes');
}

export async function borrarPlanEstudio(plan: PlanEstudio) {
    try {
        await sql`
        DELETE FROM Plan_de_Estudios WHERE nombre = ${plan.nombre};
        `;
    } catch (error) {
        return {
            message: 'Database Error: No se pudo borrar el plan de estudio',
        };
    }
    revalidatePath('/gestion-planes');
    redirect('/gestion-planes');
}


//AULAS
const CrearAulaFormSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'Colocar un nombre para el aula'
    }).min(1,{message: 'Poner una nombre para el aula'}),
    materia: z.string({
        invalid_type_error: 'Colocar al menos una materia'
    }).min(1,{message: 'Poner una materia'}),
    año: z.string({
        invalid_type_error: 'Debe seleccionar un año'
    })
    .refine((val) => val === currentYear,{
        message: "El año debe ser el actual:${ currentYear }"
    }),
    turno: z.enum(['Mañana', 'Tarde'])
            .refine(
                (val) => ['Mañana', 'Tarde']
                .includes(val), {
                    message: 'El turno debe ser Mañana o Tarde',
                }),
    profesores: z.array(z.string()).optional(),
    alumnos: z.array(z.string()).optional(),
  });


// MODIFICAR EN BASE A COMO ESTEN LAS TABLAS EN LA BASE DE DATOS, NO ESTA DEFINIDO AUN
export async function crearAula(prevState: AulaState, formData: FormData){
    console.log(formData);

    const validatedFields = CrearAulaFormSchema.safeParse({
        nombre: formData.get('nombre'),
        materia: formData.get('materia'),
        turno: formData.get('turno'),
        año: formData.get('year'),
        profesores: formData.getAll('profesores') as string[],
        alumnos: formData.getAll('alumnos') as string[],
    });

    console.log("validatedFields "+JSON.stringify(validatedFields));

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Error al crear un aula. Error en los campos.',
        };
    }

    const { 
        nombre,
        materia,
        turno,
        año,
        profesores,
        alumnos,
    } = validatedFields.data;

    try {
        const result = await sql`
        INSERT INTO Aula (Nombre, Año, Turno, Codigo_Materia)
        VALUES (${nombre}, ${año}, ${turno}, ${materia})
        RETURNING Aula_ID;
        `;

        //Si tiene profesores o alumnos, instertarlos a las tablas intermedias
        const aulaId = result.rows[0].aula_id;
        console.log("aulaid "+aulaId);

        if (profesores && Array.isArray(profesores)) {
            for (const profesorDNI of profesores) {
                await sql`
                INSERT INTO Aula_Usuario (Aula_ID, DNI) values (${aulaId}, ${profesorDNI}});
                `;
            }
        }
        
        if (alumnos && Array.isArray(alumnos)) {
            for (const alumnoDNI of alumnos) {
                await sql`
                INSERT INTO Aula_Usuario (Aula_ID, DNI) values (${aulaId}, ${alumnoDNI}});
                `;
            }
        }
        
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Error en la base de datos: error al crear un plan de estudio.',
        };
    }
    revalidatePath('/gestion-aulas');
    redirect('/gestion-aulas');
}

// MODIFICAR EN BASE A COMO ESTEN LAS TABLAS EN LA BASE DE DATOS, NO ESTA DEFINIDO AUN
export async function borrarAula(aula: Aula) {
    try {
        await sql`
        DELETE FROM Aulas WHERE Aula_ID = ${aula.codigo};
        `;
    } catch (error) {
        return {
            message: 'Database Error: No se pudo borrar el plan de estudio',
        };
    }
    revalidatePath('/gestion-aulas');
    redirect('/gestion-aulas');
}
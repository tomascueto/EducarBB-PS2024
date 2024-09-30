export type Usuario = {
    dni: string;
    nombres: string;
    apellido: string;
    email: string;
    contraseña: string;
    fecha_nac: string;
    rol: string;
};

export type UsuarioState = {
    errors?: {
        nombres?: string[];
        apellido?: string[];
        dni?: string[];
        email?: string[];
        contraseña?: string[];
        fecha_nac?: string[];
    };
    message?: string | null;
};



export type Rol = {
    nombre: string;
};




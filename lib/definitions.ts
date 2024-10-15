export type Usuario = {
    dni: string;
    nombres: string;
    apellido: string;
    email: string;
    contraseña: string;
    fechanacimiento: string;
    rol: string;
};

export type UsuarioState = {
    errors?: {
        nombres?: string[];
        apellido?: string[];
        dni?: string[];
        email?: string[];
        contraseña?: string[];
        fechanacimiento?: string[];
        rol?: string[];
    };
    message?: string | null;
};

export type UsuarioModificationState = {
    errors?: {
        nombres?: string[];
        apellido?: string[];
        dni?: string[];
        prevDni?: string[];
        email?: string[];
        contraseña?: string[];
    };
    message?: string | null;
};

export type Rol = {
    nombre: string;
};


export type AuthError = {
    type: string;
    message: string;
};
  
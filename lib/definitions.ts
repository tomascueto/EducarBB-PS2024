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
  

export type Materia = {
    nombre: string;
    codigo: string;
    plan?: File;
};

export type MateriaState = {
    errors?: {
        nombre?: string[];
        codigo?: string[];
        plan?: string[];
    };
    message?: string | null;
};

export type PlanEstudio = {
    nombre: string;
    materias: Materia_Plan[];
};

export type PlanEstudioState = {
    errors?: {
        nombre?: string[];
        materias?: string[];
    };
    message?: string | null;
};

export type Materia_Plan = {
    materia: Materia;
    año: string;
};
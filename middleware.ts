import { NextRequest, NextResponse } from 'next/server';
import {jwtVerify} from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET) || '';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const pathname = new URL(req.url).pathname;
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userRole = (payload as { rol?: string }).rol;

    if (!userRole) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/home') && !['Administrador', 'Alumno', 'Padre', 'Docente', 'Directivo'].includes(userRole)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/gestion-usuarios') && (userRole !== 'Administrador')) {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    if (pathname.startsWith('/gestion-materias') && (userRole !== 'Administrador')) {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    if (pathname.startsWith('/gestion-planes') && (userRole !== 'Administrador')) {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    if (pathname.startsWith('/gestion-aulas') && !['Administrador', 'Docente'].includes(userRole)) {
      return NextResponse.redirect(new URL('/home', req.url));
    }


    return NextResponse.next();
  } catch (err) {
    console.log(err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [ '/home', '/gestion-usuarios/:path*', '/gestion-materias/:path*', '/gestion-planes/:path*', '/gestion-aulas/:path*'], // para rutas en especifico
};

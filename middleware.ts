import { NextRequest, NextResponse } from 'next/server';
import {jwtVerify} from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET) || '';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const user = await jwtVerify(token, SECRET_KEY);

    if (req.url.startsWith('/home') && (user.payload.rol !== 'Administrador' || 'Alumno' || 'Padre' || 'Docente' || 'Directivo')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (req.url.startsWith('/gestion-usuarios') && (user.payload.rol !== 'Administrador')) {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log(err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/gestion-usuarios', '/home', '/dashboard/:path*'], // para rutas en especifico
};

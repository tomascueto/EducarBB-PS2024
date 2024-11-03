import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    
      <div className="grid grid-cols-2 gap-4">

        <Link href="/gestion-aulas">
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <h2 className="font-bold text-3xl">Gestionar aulas</h2>
            <p className="text-lg">Ingresar a la gestion de aulas</p>
          </div>
        </Link>

        <Link href="/gestion-materias">
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <h2 className="font-bold text-3xl">Gestionar materias</h2>
            <p className="text-lg">Ingresar a la gestion de materias</p>
          </div>
        </Link>

        <Link href="/gestion-planes">
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <h2 className="font-bold text-3xl">Gestionar planes</h2>
            <p className="text-lg">Ingresar a la gestion de planes</p>
          </div>
        </Link>

        <Link href="/gestion-usuarios">
          <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
            <h2 className="font-bold text-3xl">Gestionar usuarios</h2>
            <p className="text-lg">Ingresar a la gestion de usuarios</p>
          </div>
        </Link>

      </div>
  );
}


import  UserWrapper  from '@/components/admin-dashboard/userwrapper';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminDashboard() {
    return(
        <>
            <div>Admin Dashboard</div>
            <Link href="/gestion-usuarios/crear">
                <Button>Crear Nuevo Usuario</Button>
            </Link>
            <UserWrapper />
        </>
    );
}
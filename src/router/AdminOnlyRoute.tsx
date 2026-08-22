import { Outlet, Navigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useMe } from '../hook/features/useUser';

// Contrairement à ProtectedRoute (qui vérifie juste "connecté ou pas"),
// celui-ci vérifie en plus que l'utilisateur a le rôle 'Admin' (staff de la
// plateforme), avant de laisser passer vers le panneau super-admin.
export default function AdminOnlyRoute() {
  const { data: user, isLoading, isError } = useMe();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Icon icon="ph:spinner-gap" className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

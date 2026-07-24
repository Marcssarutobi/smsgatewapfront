import { Outlet, Navigate } from "react-router-dom";
import { useMe } from "../hook/features/useUser";
import { Icon } from "@iconify/react";

export default function ProtectedRoute() {
  const { data, isLoading, isError } = useMe();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Icon icon="ph:spinner-gap" className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
import { type ReactNode } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";
import { Navigate } from "react-router-dom";

interface PublicRoutesProps {
  children: ReactNode;
}

const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const { user, isLoading } = useAuthContext();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  if (isLoading) return null;

  return <>{children}</>;
};

export default PublicRoutes;

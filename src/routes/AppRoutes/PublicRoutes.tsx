import { type ReactNode } from "react";
import { Redirect } from "react-router-dom";
import { useAuthContext } from "../../context/auth/AuthContext";

interface PublicRoutesProps {
  children: ReactNode;
}

const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return null;

  return <>{children}</>;
};

export default PublicRoutes;

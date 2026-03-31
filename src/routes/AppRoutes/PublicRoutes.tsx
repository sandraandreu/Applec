import { type ReactNode } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";
import { Redirect } from "react-router";

interface PublicRoutesProps {
  children: ReactNode;
}

const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const { user, isLoading } = useAuthContext();

  if (user) {
    return <Redirect to="/home" />;
  }

  if (isLoading) return null;

  return <>{children}</>;
};

export default PublicRoutes;

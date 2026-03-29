import { type ReactNode } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";

interface PublicRoutesProps {
  children: ReactNode;
}

const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const { isLoading } = useAuthContext();

  if (isLoading) return null;

  return <>{children}</>;
};

export default PublicRoutes;

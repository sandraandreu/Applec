import { type ReactNode } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../../components/loading/Loading";

interface PublicRoutesProps {
  children: ReactNode;
}

const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const { user, isLoading } = useAuthContext();

  if (user && user.emailVerified) {
    return <Navigate to="/home" replace />;
  }

  if (isLoading) return <Loading />;

  return <>{children}</>;
};

export default PublicRoutes;

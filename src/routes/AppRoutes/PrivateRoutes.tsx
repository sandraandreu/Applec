import { type ReactNode } from "react";
import { Redirect } from "react-router-dom";
import { useAuthContext } from "../../context/auth/AuthContext";

interface PrivateRoutesProps {
  children: ReactNode;
}

const PrivateRoutes = ({ children }: PrivateRoutesProps) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (!user) return <Redirect to="/login" />;

  return <>{children}</>;
};

export default PrivateRoutes;

import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth/AuthContext";
import { useGroupContext } from "../../context/group/GroupContext";
import Loading from "../../components/loading/Loading";


interface PrivateRoutesProps {
  children: ReactNode;
  requiresGroup?: boolean;
}

const PrivateRoutes = ({ children, requiresGroup = false }: PrivateRoutesProps) => {
  const { user, isLoading: authLoading } = useAuthContext();
  const { group, isLoading: groupLoading } = useGroupContext();

  if (authLoading || groupLoading) return <Loading />;

  if (!user) return <Navigate to="/landing" replace />;

  if (requiresGroup && !group) return <Navigate to="/onboarding/welcome" replace />;

  return <>{children}</>;
};

export default PrivateRoutes;

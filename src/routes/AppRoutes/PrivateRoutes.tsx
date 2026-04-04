import { type ReactNode } from "react";
import { Redirect } from "react-router-dom";
import { useAuthContext } from "../../context/auth/AuthContext";
import { useGroupContext } from "../../context/group/GroupContext";


interface PrivateRoutesProps {
  children: ReactNode;
  requiresGroup?: boolean;
}

const PrivateRoutes = ({ children, requiresGroup = false }: PrivateRoutesProps) => {
  const { user, isLoading: authLoading } = useAuthContext();
  const { groupId, isLoading: groupLoading } = useGroupContext();

  if (authLoading || groupLoading) return null;

  if (!user) return <Redirect to="/landing" />;

  if (requiresGroup && !groupId) return <Redirect to="/onboarding/welcome" />;

  return <>{children}</>;
};

export default PrivateRoutes;

import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth/AuthContext";
import { useGroupContext } from "../../context/group/GroupContext";
import Loading from "../../components/loading/Loading";

interface PrivateRoutesProps {
  children: ReactNode;
  requiresGroup?: boolean;
  requiresNoGroup?: boolean;
}

const PrivateRoutes = ({
  children,
  requiresGroup = false,
  requiresNoGroup = false,
}: PrivateRoutesProps) => {
  const { user, profile, isLoading: authLoading } = useAuthContext();
  const { isLoading: groupLoading } = useGroupContext();

  if (authLoading || (requiresGroup && groupLoading)) return <Loading />;

  if (!user) return <Navigate to="/landing" replace />;
  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  if (requiresGroup && !profile?.groupId)
    return <Navigate to="/onboarding/welcome" replace />;

  if (requiresNoGroup && profile?.groupId)
    return <Navigate to="/events" replace />;

  return <>{children}</>;
};

export default PrivateRoutes;

import { type ReactNode } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../../components/loading/Loading";

interface PublicRoutesProps {
  children: ReactNode;
}

const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const { user, profile, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loading />;
  }

  if (user && user.emailVerified) {
    return (
      <Navigate
        to={profile?.groupId ? "/events" : "/onboarding/welcome"}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PublicRoutes;

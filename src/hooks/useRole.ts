import { useAuthContext } from "../context/auth/AuthContext";
import { useGroupContext } from "../context/group/GroupContext";

const useRole = () => {
  const { user } = useAuthContext();
  const { group } = useGroupContext();

  const currentMember = group?.members?.find((member) => {
    return member.uid === user?.uid;
  });

  const isAdmin = currentMember?.role === "admin";
  const isOrganizer = currentMember?.role === "organizer";
  const isMember = currentMember?.role === "member";

  return { isAdmin, isOrganizer, isMember };
};

export default useRole;
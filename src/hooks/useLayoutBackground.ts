import { useEffect } from "react";
import type { UserProfile } from "../models/user.model";

const roleToClass: Record<UserProfile["role"], string> = {
  admin: "main-layout--bg-red",
  organizer: "main-layout--bg-teal",
  member: "main-layout--bg-blue",
};

const useLayoutBackground = (role: UserProfile["role"] | undefined) => {
  useEffect(() => {
    if (!role) return;
    const layout = document.querySelector(".main-layout");
    const className = roleToClass[role];
    layout?.classList.add(className);
    return () => layout?.classList.remove(className);
  }, [role]);
};

export default useLayoutBackground;

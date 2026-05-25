import { useEffect } from "react";
import type { UserProfile } from "../models/user.model";

type Variant = "full" | "top";

const roleToGradient: Record<UserProfile["role"], string> = {
  admin:     "var(--color-bg-gradient-red)",
  organizer: "var(--color-bg-gradient-teal)",
  member:    "var(--color-bg-gradient-blue)",
};

const useLayoutBackground = (role: UserProfile["role"] | undefined, variant: Variant = "full") => {
  useEffect(() => {
    if (!role) return;
    const gradient = roleToGradient[role];
    const value = variant === "top"
      ? `${gradient} no-repeat top / 100% 350px`
      : gradient;
    document.documentElement.style.setProperty("--page-bg", value);
    return () => { document.documentElement.style.removeProperty("--page-bg"); };
  }, [role, variant]);
};

export default useLayoutBackground;

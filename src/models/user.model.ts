import { type User as FirebaseUser } from "firebase/auth";

export interface LinkedMember {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string | null;
  photoUrl?: string;
  createdAt: Date;
  role: "admin" | "organizer" | "member";
  groupId?: string;
  linkedMembers?: LinkedMember[];
}

export type UserProfileCreate = Omit<UserProfile, "groupId">;

export interface UserPermissions {
  canCreateEvents: boolean;
  canDeleteEvents: boolean;
  canEditOwnEvents: boolean;
  canEditAllEvents: boolean;
  canManageMembers: boolean;
  canSeeAttendees: boolean;
  canSeeDetailedFilters: boolean;
}

export interface User extends FirebaseUser {
  permissions: UserPermissions;
}

export function computePermissions(role: UserProfile["role"] | undefined): UserPermissions {
  const isAdmin = role === "admin";
  const isOrganizer = role === "organizer";
  return {
    canCreateEvents: isAdmin || isOrganizer,
    canDeleteEvents: isAdmin || isOrganizer,
    canEditOwnEvents: isOrganizer,
    canEditAllEvents: isAdmin,
    canManageMembers: isAdmin,
    canSeeAttendees: isAdmin || isOrganizer,
    canSeeDetailedFilters: isAdmin || isOrganizer,
  };
}

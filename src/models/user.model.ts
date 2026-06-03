import { type User as FirebaseUser } from "firebase/auth";

export type LinkedMemberType = "fallero" | "extern";

export interface LinkedMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  type?: LinkedMemberType;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string | null;
  photoUrl?: string;
  createdAt: Date;
  role: "admin" | "organizer" | "member";
  groupId?: string;
  groupDeleted?: boolean;
  pendingJoinGroupId?: string;
  joinAccepted?: boolean;
  joinRejected?: boolean;
  linkedMembers?: LinkedMember[];
}

export interface JoinRequest {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  requestedAt: Date;
}

export interface AcceptedRequest {
  uid: string;
  firstName: string;
  lastName: string;
  acceptedAt: Date;
}

export type UserProfileCreate = Omit<UserProfile, "groupId">;

export interface UserPermissions {
  canCreateEvents: boolean;
  canDeleteEvents: boolean;
  canEditOwnEvents: boolean;
  canEditAllEvents: boolean;
  canManageMembers: boolean;
  canInviteMembers: boolean;
  canManageGroup: boolean;
  canShareAccess: boolean;
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
    canInviteMembers: isAdmin || isOrganizer,
    canManageGroup: isAdmin,
    canShareAccess: isAdmin || isOrganizer,
  };
}

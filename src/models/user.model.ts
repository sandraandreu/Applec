export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string | null;
  createdAt: Date;
  role: "admin" | "organizer" | "member";
  groupId?: string;
}

export type UserProfileCreate = Omit<UserProfile, "groupId">;

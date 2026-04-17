export interface UserProfile {
  username: string;
  fullName: string;
  email: string | null;
  createdAt: Date;
  role: string;
  groupId?: string;
}

export type UserProfileCreate = Omit<UserProfile, "groupId">;

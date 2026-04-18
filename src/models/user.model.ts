export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string | null;
  createdAt: Date;
  role: string;
  groupId?: string;
}

export type UserProfileCreate = Omit<UserProfile, "groupId">;

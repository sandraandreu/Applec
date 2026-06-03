import { memo } from "react";
import type { AttendanceVote } from "../../models/attendance.model";
import "./avatar.scss";

type AvatarRole = "admin" | "organizer" | "member";
type AvatarSize = "sm" | "md" | "lg";
export type AvatarAttendance = AttendanceVote | "pending";

interface AvatarProps {
  firstName: string;
  lastName: string;
  role?: AvatarRole;
  size?: AvatarSize;
  attendance?: AvatarAttendance;
  photoUrl?: string;
}

const Avatar = ({ firstName, lastName, role = "member", size = "md", attendance, photoUrl }: AvatarProps) => {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  const colorClass = attendance ? `avatar--${attendance}` : `avatar--${role}`;

  return (
    <div className={`avatar ${colorClass} avatar--${size}`}>
      {photoUrl ? (
        <img src={photoUrl} alt={`${firstName} ${lastName}`} className="avatar__photo" />
      ) : (
        initials
      )}
    </div>
  );
};

export default memo(Avatar);

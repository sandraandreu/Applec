import "./avatar.scss";

type AvatarRole = "admin" | "organizer" | "member";
type AvatarSize = "sm" | "md" | "lg";
export type AvatarAttendance = "going" | "pending" | "not-going";

interface AvatarProps {
  firstName: string;
  lastName: string;
  role?: AvatarRole;
  size?: AvatarSize;
  attendance?: AvatarAttendance;
}

const Avatar = ({ firstName, lastName, role = "member", size = "md", attendance }: AvatarProps) => {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  const colorClass = attendance ? `avatar--${attendance}` : `avatar--${role}`;

  return (
    <div className={`avatar ${colorClass} avatar--${size}`}>
      {initials}
    </div>
  );
};

export default Avatar;

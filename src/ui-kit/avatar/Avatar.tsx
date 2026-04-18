import "./avatar.scss";

type AvatarRole = "admin" | "organizer" | "member";
type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  firstName: string;
  lastName: string;
  role?: AvatarRole;
  size?: AvatarSize;
}

const Avatar = ({ firstName, lastName, role = "member", size = "md" }: AvatarProps) => {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className={`avatar avatar--${role} avatar--${size}`}>
      {initials}
    </div>
  );
};

export default Avatar;

import "./member-card.scss";
import Avatar from "../../ui-kit/avatar/Avatar";

interface MemberCardProps {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "organizer" | "member";
}

const MemberCard = ({ firstName, lastName, email, role }: MemberCardProps) => {
  const roleLabel =
    role === "admin" ? "Admin" : role === "organizer" ? "Org." : "Miemb.";

  return (
    <div className="member-card">
      <Avatar firstName={firstName} lastName={lastName} role={role} size="md" />
      <div className="member-card__info">
        <span className="member-card__name">{firstName} {lastName}</span>
        <span className="member-card__email">{email}</span>
      </div>
      <div className={`member-card__role member-card__role--${role}`}>{roleLabel}</div>
    </div>
  );
};

export default MemberCard;

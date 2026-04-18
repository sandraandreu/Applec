import "./member-card.scss";

interface MemberCardProps {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const MemberCard = ({ firstName, lastName, email, role }: MemberCardProps) => {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  const roleLabel =
    role === "admin" ? "Admin" : role === "organizer" ? "Org." : "Miemb.";

  return (
    <div className="member-card">
      <div className={`member-card__avatar member-card__avatar--${role}`}>{initials}</div>
      <div className="member-card__info">
        <span className="member-card__name">{firstName} {lastName}</span>
        <span className="member-card__email">{email}</span>
      </div>
      <div className={`member-card__role member-card__role--${role}`}>{roleLabel}</div>
    </div>
  );
};

export default MemberCard;

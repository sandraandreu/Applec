import "./MemberCard.scss";
interface MemberCardProps {
  name: string;
  fullName: string;
  role: string;
}

const MemberCard = ({ name, fullName, role }: MemberCardProps) => {
  const initials = fullName
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const roleLabel =
    role === "admin" ? "Admin" : role === "organizer" ? "Org." : "Miembro";

  return (
    <div className="member-card">
      <div className={`member-card__avatar member-card__avatar--${role}`}>{initials}</div>
      <div className="member-card__info">
        <span className="member-card__name">{name}</span>
        <span className="member-card__fullName">{fullName}</span>
      </div>
      <div className={`member-card__role member-card__role--${role}`}>{roleLabel}</div>
    </div>
  );
};

export default MemberCard;

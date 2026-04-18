import "./member-card.scss";
import Avatar from "../../ui-kit/avatar/Avatar";
import Chip from "../../ui-kit/chip/Chip";

interface MemberCardProps {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "organizer" | "member";
}

const MemberCard = ({ firstName, lastName, email, role }: MemberCardProps) => {
  return (
    <div className="member-card">
      <Avatar firstName={firstName} lastName={lastName} role={role} size="md" />
      <div className="member-card__info">
        <span className="member-card__name">{firstName} {lastName}</span>
        <span className="member-card__email">{email}</span>
      </div>
      <Chip role={role} variant="short" />
    </div>
  );
};

export default MemberCard;

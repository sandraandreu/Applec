import Icon, { type IconName } from "../icon/Icon";

interface IconButtonProps {
  name: IconName;
  ariaLabel: string;
  onClick: () => void;
  size?: number;
  className?: string;
  ariaPressed?: boolean;
}

const IconButton = ({ name, ariaLabel, onClick, size, className, ariaPressed }: IconButtonProps) => (
  <button
    type="button"
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    onClick={onClick}
    className={className}
  >
    <Icon name={name} size={size} />
  </button>
);

export default IconButton;

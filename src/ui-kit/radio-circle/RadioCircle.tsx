import "./radio-circle.scss";

interface RadioCircleProps {
  selected: boolean;
}

const RadioCircle = ({ selected }: RadioCircleProps) => (
  <span className={`radio-circle${selected ? " radio-circle--selected" : ""}`} />
);

export default RadioCircle;

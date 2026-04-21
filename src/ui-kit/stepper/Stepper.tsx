import "./stepper.scss";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const Stepper = ({ currentStep, totalSteps }: StepperProps) => {
  return (
    <div className="stepper">
      {Array.from({ length: totalSteps }, (_, i) => (
        <span
          key={i}
          className={`stepper__dot${i + 1 === currentStep ? " stepper__dot--active" : ""}`}
        />
      ))}
    </div>
  );
};

export default Stepper;

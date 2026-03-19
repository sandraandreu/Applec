import { IonSpinner } from "@ionic/react";
import "./Loading.scss";

type SpinnerName = "bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-small" | "lines-sharp" | "lines-sharp-small";

interface LoadingProps {
  message?: string;
  name?: SpinnerName;
  color?: string;
}

const Loading = ({ message, name = "circles", color = "primary" }: LoadingProps) => {
  return (
    <>
      <IonSpinner name={name} color={color} />
      {message && <p>{message}</p>}
    </>
  );
};

export default Loading;

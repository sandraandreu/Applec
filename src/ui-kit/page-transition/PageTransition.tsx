import type { ReactNode } from "react";
import { useNavigationType } from "react-router-dom";
import "./page-transition.scss";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const navigationType = useNavigationType();
  const direction = navigationType === "POP" ? "backward" : "forward";

  return (
    <div className={`page-transition page-transition--${direction}`}>
      {children}
    </div>
  );
};

export default PageTransition;

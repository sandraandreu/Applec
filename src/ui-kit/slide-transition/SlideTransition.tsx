import type { ReactNode } from "react";
import "./slide-transition.scss";

interface SlideTransitionProps {
  children: ReactNode;
  direction: "forward" | "backward";
}

const SlideTransition = ({ children, direction }: SlideTransitionProps) => (
  <div className={`slide-transition slide-transition--${direction}`}>
    {children}
  </div>
);

export default SlideTransition;

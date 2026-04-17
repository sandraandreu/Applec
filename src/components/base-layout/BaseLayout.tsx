import "./base-layout.scss";
import { ReactNode } from "react";

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="page">
      <main className="page-content">
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;

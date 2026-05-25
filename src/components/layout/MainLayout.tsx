import type { ReactNode } from "react";
import TopBar from "./TopBar";
import TabBar from "./TabBar";
import "./layout.scss";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="main-layout">
      <TopBar />
      <div className="main-layout__content">{children}</div>
      <TabBar />
    </div>
  );
};

export default MainLayout;

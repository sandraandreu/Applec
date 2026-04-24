import type { ReactNode } from "react";
import TopBar from "../top-bar/TopBar";
import TabBar from "../tab-bar/TabBar";
import "./main-layout.scss";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => (
  <div className="main-layout">
    <TopBar />
    <div className="main-layout__content">{children}</div>
    <TabBar />
  </div>
);

export default MainLayout;

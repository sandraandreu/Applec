import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/auth/AuthContext";
import TopBar from "./TopBar";
import TabBar from "./TabBar";
import "./layout.scss";

interface Props {
  children: ReactNode;
}

const gradientByRole: Record<string, string> = {
  admin: "main-layout--bg-red-top",
  organizer: "main-layout--bg-teal-top",
  member: "main-layout--bg-blue-top",
};

const MainLayout = ({ children }: Props) => {
  const { profile } = useAuthContext();
  const { pathname } = useLocation();

  const bgClass = pathname === "/profile" && profile
    ? gradientByRole[profile.role] ?? ""
    : "";

  return (
    <div className={`main-layout${bgClass ? ` ${bgClass}` : ""}`}>
      <TopBar />
      <div className="main-layout__content">{children}</div>
      <TabBar />
    </div>
  );
};

export default MainLayout;

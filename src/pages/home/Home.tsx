import "./home.scss";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";

const Home = () => {
  const { logout } = useAuthContext();
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <header className="toolbar">
        <h1>{t("bienvenida")}</h1>
        <button onClick={logout}>{t("buttons.logout")}</button>
      </header>
    </div>
  );
};

export default Home;

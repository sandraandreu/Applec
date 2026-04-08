import "./Home.scss";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/auth/AuthContext";
import BaseLayout from "../../components/layout/baseLayout/BaseLayout";

const Home = () => {
  const { logout } = useAuthContext();
  const { t } = useTranslation();

  return (
    <BaseLayout>
      <header className="toolbar">
        <h1>{t("bienvenida")}</h1>
        <button onClick={logout}>Logout</button>
      </header>
    </BaseLayout>
  );
};

export default Home;

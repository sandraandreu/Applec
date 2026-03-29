import "./Home.scss";
import { useTranslation } from "react-i18next";
import Alert from "../../components/feedback/alerts/Alert";
import { useState } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";
import LanguageSelector from "../../components/ui/language/LanguageSelector";

const Home = () => {
  const { logout } = useAuthContext();
  const { t } = useTranslation();
  const [testAlert, setTestAlert] = useState<"header" | "alert">("alert");

  return (
    <div className="page">
      <main className="page-content">
        <header className="toolbar">
          <h1>{t("bienvenida")}</h1>
          <button onClick={logout}>Logout</button>
          <LanguageSelector />
        </header>
      </main>
    </div>
  );
};

export default Home;

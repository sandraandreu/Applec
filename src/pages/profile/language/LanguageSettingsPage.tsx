import "./language-settings.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../context/auth/AuthContext";
import useLayoutBackground from "../../../hooks/useLayoutBackground";
import PageHeader from "../../../components/layout/PageHeader";
import LanguageSelector from "../../../components/language-selector/LanguageSelector";

const LanguageSettingsPage = () => {
  const { t } = useTranslation("profile");
  const { profile } = useAuthContext();
  const navigate = useNavigate();

  useLayoutBackground(profile?.role);

  return (
    <div className="language-settings-page">
      <PageHeader title={t("languageSettings.title")} onBack={() => navigate(-1)} />
      <div className="language-settings-page__content">
        <div className="language-settings-page__header">
          <h2 className="language-settings-page__subtitle">
            {t("languageSettings.subtitle")}
          </h2>
          <p className="language-settings-page__description">
            {t("languageSettings.description")}
          </p>
        </div>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default LanguageSettingsPage;

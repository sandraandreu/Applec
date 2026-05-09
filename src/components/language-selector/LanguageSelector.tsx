import { useEffect, useState } from "react";
import "./language-selector.scss";
import { useTranslation } from "react-i18next";
import Button from "../../ui-kit/button/Button";
import Icon from "../../ui-kit/icons/icon/Icon";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation("common");

  const [language, setLanguage] = useState<"es" | "ca">("es");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as
      | "es"
      | "ca"
      | null;
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: "es" | "ca") => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const globeIcon = <Icon name="globe" size={24} />;

  return (
    <div className="language-selector">
      <Button
        text={t("language.spanish")}
        variant="language"
        icon={globeIcon}
        isActiveLanguage={language === "es"}
        onClick={() => handleLanguageChange("es")}
      />
      <Button
        text={t("language.valencian")}
        variant="language"
        icon={globeIcon}
        isActiveLanguage={language === "ca"}
        onClick={() => handleLanguageChange("ca")}
      />
    </div>
  );
};

export default LanguageSelector;

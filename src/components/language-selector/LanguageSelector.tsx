import { useEffect, useState } from "react";
import "./language-selector.scss";
import { useTranslation } from "react-i18next";
import Button from "../../ui-kit/button/Button";
import RadioCircle from "../../ui-kit/radio-circle/RadioCircle";

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
  }, [i18n]);

  const handleLanguageChange = (lang: "es" | "ca") => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className="language-selector">
      <Button
        text={t("language.spanish")}
        variant="language"
        icon={<RadioCircle selected={language === "es"} />}
        isActiveLanguage={language === "es"}
        onClick={() => handleLanguageChange("es")}
      />
      <Button
        text={t("language.valencian")}
        variant="language"
        icon={<RadioCircle selected={language === "ca"} />}
        isActiveLanguage={language === "ca"}
        onClick={() => handleLanguageChange("ca")}
      />
    </div>
  );
};

export default LanguageSelector;

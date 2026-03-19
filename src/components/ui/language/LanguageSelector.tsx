import { useEffect, useState } from "react";
import "./LanguageSelector.scss";
import { useTranslation } from "react-i18next";
import Button from "../button/Button";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

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

  return (
    <>
      <Button
        text={t("language_spanish")}
        variant="language"
        isActive={language === "es"}
        onClick={() => handleLanguageChange("es")}
      />
      <Button
        text={t("language_valencian")}
        variant="language"
        isActive={language === "ca"}
        onClick={() => handleLanguageChange("ca")}
      />
    </>
  );
};

export default LanguageSelector;

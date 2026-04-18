import { useEffect, useState } from "react";
import "./language-selector.scss";
import { useTranslation } from "react-i18next";
import Button from "../../ui-kit/button/Button";

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

  const globeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12.0001 2.24976C6.61559 2.24976 2.25012 6.61522 2.25012 11.9998C2.25012 17.3843 6.61559 21.7498 12.0001 21.7498C17.3847 21.7498 21.7501 17.3843 21.7501 11.9998C21.7501 6.61522 17.3847 2.24976 12.0001 2.24976Z" stroke="#0068FF" strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M12 2.24976C9.278 2.24976 6.71863 6.61522 6.71863 11.9998C6.71863 17.3843 9.278 21.7498 12 21.7498C14.7221 21.7498 17.2814 17.3843 17.2814 11.9998C17.2814 6.61522 14.7221 2.24976 12 2.24976Z" stroke="#0068FF" strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M5.5 5.49951C7.2925 6.77217 9.54906 7.53107 12.0002 7.53107C14.4513 7.53107 16.7078 6.77217 18.5003 5.49951M18.5003 18.4998C16.7078 17.2272 14.4513 16.4683 12.0002 16.4683C9.54906 16.4683 7.2925 17.2272 5.5 18.4998" stroke="#0068FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21.7501 11.9998H2.25012M12.0001 2.24976V21.7498V2.24976Z" stroke="#0068FF" strokeWidth="1.5" strokeMiterlimit="10"/>
    </svg>
  );

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

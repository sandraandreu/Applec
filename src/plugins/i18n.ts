import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEs from "../locals/ES/es.json";
import translationCa from "../locals/CA/ca.json";


// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)


const resources = {
  es: {
    translation: translationEs,
  },
  ca: {
    translation: translationCa,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "es", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: "es",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

// import { useTranslation } from 'react-i18next';
// const { t } = useTranslation();
// <h1>{t('bienvenida')}</h1>
        
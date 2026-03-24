import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import esCommon from "../locales/es/common.json";
import esAuth from "../locales/es/auth.json";
import esWelcome from "../locales/es/welcome.json";
import esGroups from "../locales/es/groups.json";

import caCommon from "../locales/ca/common.json";
import caAuth from "../locales/ca/auth.json";
import caWelcome from "../locales/ca/welcome.json";
import caGroups from "../locales/ca/groups.json";

const resources = {
  es: {
    common: esCommon,
    auth: esAuth,
    welcome: esWelcome,
    groups: esGroups,
  },
  ca: {
    common: caCommon,
    auth: caAuth,
    welcome: caWelcome,
    groups: caGroups,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    defaultNS: "common",
    ns: ["common", "auth", "welcome", "groups"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

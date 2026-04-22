import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import esCommon from "../locales/es/common.json";
import esAuth from "../locales/es/auth.json";
import esOnboarding from "../locales/es/onboarding.json";
import esGroups from "../locales/es/groups.json";
import esMembers from "../locales/es/members.json";

import caCommon from "../locales/ca/common.json";
import caAuth from "../locales/ca/auth.json";
import caOnboarding from "../locales/ca/onboarding.json";
import caGroups from "../locales/ca/groups.json";
import caMembers from "../locales/ca/members.json";

const resources = {
  es: {
    common: esCommon,
    auth: esAuth,
    onboarding: esOnboarding,
    groups: esGroups,
    members: esMembers,
  },
  ca: {
    common: caCommon,
    auth: caAuth,
    onboarding: caOnboarding,
    groups: caGroups,
    mmembers: caMembers,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    defaultNS: "common",
    ns: ["common", "auth", "onboarding", "groups"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;

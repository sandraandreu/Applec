import { es, ca } from "react-day-picker/locale";
import type { Locale } from "date-fns";

export const combineDateAndTime = (date: Date, time: string): Date => {
  const combined = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};

export const getIntlLocale = (language: string): string =>
  language === "ca" ? "ca-ES" : "es-ES";

export const getDateFnsLocale = (language: string): Locale =>
  language === "ca" ? ca : es;

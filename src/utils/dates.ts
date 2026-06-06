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

export const toLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDayLabel = (date: Date, locale: string): string => {
  const weekday = date
    .toLocaleDateString(locale, { weekday: "short" })
    .replace(".", "")
    .toUpperCase();
  const dayMonth = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(date);
  return `${weekday} ${dayMonth}`;
};

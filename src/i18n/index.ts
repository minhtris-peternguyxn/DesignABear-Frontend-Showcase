import vi, { type Dictionary } from "./vi";
import en from "./en";

export type Locale = "vi" | "en";
export { type Dictionary };

export const dictionaries: Record<Locale, Dictionary> = {
  vi,
  en,
};

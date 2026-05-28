"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import zh from "./zh";
import en from "./en";

export type Lang = "zh" | "en";

const translations: Record<Lang, any> = { zh, en };

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: "zh",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  return ctx;
}

export function t(lang: Lang, key: string): string {
  const keys = key.split(".");
  let value: any = translations[lang];
  for (const k of keys) {
    if (value == null) return key;
    value = value[k];
  }
  return typeof value === "string" ? value : key;
}
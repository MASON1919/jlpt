"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ko from "@/locales/ko.json";
import en from "@/locales/en.json";

export type Language = "ko" | "en";

type TranslationData = typeof ko;

const translations: Record<Language, TranslationData> = { ko, en };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationData;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "jlpt-master-language";

function getBrowserLanguage(): Language {
  if (typeof window === "undefined") return "ko";

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("ko")) return "ko";
  if (browserLang.startsWith("en")) return "en";
  return "en";
}

function getSavedLanguage(): Language | null {
  if (typeof window === "undefined") return null;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "ko" || saved === "en") return saved;
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ko");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getSavedLanguage();
    const initialLang = saved ?? getBrowserLanguage();
    setLanguageState(initialLang);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{ language: "ko", setLanguage, t: translations.ko }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Helper function for server components
export function getTranslations(lang: Language): TranslationData {
  return translations[lang];
}

// Get all available languages for the selector
export const availableLanguages: { code: Language; label: string }[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
];

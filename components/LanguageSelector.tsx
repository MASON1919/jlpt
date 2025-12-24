"use client";

import { useLanguage, availableLanguages, Language } from "@/lib/i18n";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface LanguageSelectorProps {
  variant?: "light" | "dark";
}

export default function LanguageSelector({ variant = "dark" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = availableLanguages.find(l => l.code === language);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const isLight = variant === "light";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isLight
            ? "text-[#5D5548] hover:text-[#2C241B] hover:bg-[#EBE7DF]"
            : "text-[#EBE7DF]/80 hover:text-white hover:bg-white/10"
        }`}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLanguage?.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${isLight ? "top-full mt-2" : "bottom-full mb-2"} right-0 rounded-lg shadow-xl overflow-hidden min-w-[120px] z-50 ${
          isLight
            ? "bg-[#FDFBF7] border border-[#D8D3C8]"
            : "bg-[#3D332A] border border-[#EBE7DF]/10"
        }`}>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                language === lang.code
                  ? "bg-[#C84B31] text-white font-medium"
                  : isLight
                    ? "text-[#5D5548] hover:bg-[#EBE7DF] hover:text-[#2C241B]"
                    : "text-[#EBE7DF]/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

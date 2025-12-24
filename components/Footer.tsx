"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import LanguageSelector from "./LanguageSelector";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#2C241B] text-[#EBE7DF]/60 py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl text-[#EBE7DF] mb-8">JLPT MASTER</h2>
        <div className="flex justify-center gap-8 mb-12 text-sm font-medium">
          <Link href="#" className="hover:text-white">
            {t.footer.serviceIntro}
          </Link>
          <Link href="#features" className="hover:text-white">
            {t.footer.features}
          </Link>
          <Link href="#pricing" className="hover:text-white">
            {t.footer.pricing}
          </Link>
          <Link href="#" className="hover:text-white">
            {t.footer.contact}
          </Link>
        </div>
        
        {/* Language Selector */}
        <div className="flex justify-center mb-8">
          <LanguageSelector />
        </div>
        
        <p className="text-xs">
          {t.footer.copyright}{" "}
          <br className="sm:hidden" /> {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
}


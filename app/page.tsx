"use client";

import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  Download,
  BookOpen,
  Check,
  XCircle,
  Languages,
  FileText,
  Zap,
} from "lucide-react";
import Footer from "../components/Footer";
import SubscribeButton from "../components/SubscribeButton";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";

export default function LandingPageSerene() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#EBE7DF] text-[#2C241B] font-sans selection:bg-[#C84B31] selection:text-white">
      {/* Language Selector - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector variant="light" />
      </div>

      {/* 1. 와이드 히어로 섹션 */}
      <header className="relative w-full h-screen min-h-[700px] flex flex-col justify-center items-center overflow-hidden px-4">
        {/* 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EBE7DF] via-[#EBE7DF] to-[#DFD8CC] z-0" />

        {/* 장식 요소 */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#2C241B]/10 -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 w-full h-[60vh] bg-[#C84B31]/5 blur-3xl -translate-y-1/2 z-0 rounded-full scale-x-150"></div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
          <div className="inline-block border border-[#2C241B] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#2C241B] mb-4">
            {t.landing.badge}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-[#2C241B] leading-none">
            {t.landing.heroTitle1} <span className="italic text-[#C84B31]">{t.landing.heroTitle2}</span>
            {t.landing.heroTitle3}
            <br />
            {t.landing.heroTitle4}
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl text-[#5D5548] leading-relaxed break-keep">
            {t.landing.heroDesc1}
            <br />
            {t.landing.heroDesc2}
            <br />
            <span className="font-bold text-[#2C241B]">{t.landing.heroDesc3}</span>
            {t.landing.heroDesc4}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button className="w-full sm:w-auto bg-[#C84B31] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#A63620] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C84B31]/20">
              <BookOpen className="w-5 h-5" />
              {t.landing.goToExam}
            </button>
            <button className="w-full sm:w-auto bg-transparent border border-[#2C241B]/30 text-[#2C241B] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#2C241B] hover:text-white transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5" />
              {t.landing.previewExplanation}
            </button>
          </div>
        </div>

        {/* 하단 스크롤 유도 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-[#2C241B]/40">
          <ArrowRight className="w-6 h-6 rotate-90" />
        </div>
      </header>

      {/* 2. 일본어 장식 */}
      <div className="w-full bg-[#2C241B] py-6 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-infinite-scroll">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="text-[#EBE7DF]/40 text-2xl font-serif mx-8 font-light italic"
            >
              JLPT合格 • 実戦模試 • 文章翻訳 • 語彙分析 • 誤答ノート •
            </span>
          ))}
        </div>
      </div>

      {/* 3. 핵심 기능 소개 */}
      <section
        id="features"
        className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="mb-16 border-b border-[#2C241B]/10 pb-8 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C241B] mb-4">
            {t.landing.featuresTitle}
          </h2>
          <p className="text-[#5D5548] text-lg">
            {t.landing.featuresDesc1}{" "}
            <span className="text-[#C84B31] font-bold">
              {t.landing.featuresDesc2}
            </span>
            {t.landing.featuresDesc3}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1: 고퀄리티 해설 & 문장 번역 */}
          <div className="bg-[#FDFBF7] rounded-3xl p-8 border border-[#D8D3C8] hover:border-[#C84B31]/50 transition-colors group">
            <div className="w-12 h-12 bg-[#2C241B] rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif text-[#2C241B] mb-3">
              {t.landing.feature1Title}
            </h3>
            <p className="text-[#5D5548] leading-relaxed mb-6 break-keep">
              {t.landing.feature1Desc}
            </p>
            <div className="bg-[#EBE7DF]/50 p-4 rounded-xl border border-[#D8D3C8]/50">
              <div className="text-sm text-[#2C241B]/60 mb-1 font-serif">
                {t.landing.feature1Example}
              </div>
              <div className="font-serif text-[#2C241B] mb-1 text-lg">
                努力した
                <span className="text-[#C84B31] font-bold">かいがあって</span>
                、合格できた。
              </div>
              <div className="text-sm text-[#5D5548]">
                → 노력한{" "}
                <span className="text-[#C84B31] underline underline-offset-4 decoration-1">
                  보람이 있어서
                </span>{" "}
                합격할 수 있었다.
              </div>
            </div>
          </div>

          {/* Feature 2: 단어 해설 */}
          <div className="bg-[#FDFBF7] rounded-3xl p-8 border border-[#D8D3C8] hover:border-[#C84B31]/50 transition-colors group">
            <div className="w-12 h-12 bg-[#C84B31] rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif text-[#2C241B] mb-3">
              {t.landing.feature2Title}
            </h3>
            <p className="text-[#5D5548] leading-relaxed mb-6 break-keep">
              {t.landing.feature2Desc}
            </p>
            <div className="flex flex-wrap gap-2">
              {["雰囲(ふんい)気", "あきらめる", "徹底(てってい)的"].map(
                (word, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#EBE7DF] rounded-lg text-sm text-[#2C241B] border border-[#D8D3C8]"
                  >
                    {word}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Feature 3: 오답 노트 (Wide) */}
          <div className="md:col-span-2 bg-[#2C241B] rounded-3xl p-8 md:p-12 text-[#EBE7DF] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="relative z-10 md:max-w-lg">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#C84B31] mb-6 backdrop-blur-sm">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-serif mb-4">{t.landing.feature3Title}</h3>
              <p className="text-[#EBE7DF]/70 leading-relaxed mb-6 break-keep">
                {t.landing.feature3Desc}
              </p>
              <button className="text-[#C84B31] font-bold hover:text-white transition-colors flex items-center gap-2">
                {t.landing.feature3More} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Visual Decoration */}
            <div className="relative z-10 grid grid-cols-2 gap-3 opacity-80">
              <div className="bg-white/10 p-4 rounded-xl border border-white/5 backdrop-blur-sm text-center">
                <div className="text-xs text-[#EBE7DF]/50 mb-1">{t.landing.feature3Accuracy}</div>
                <div className="text-2xl font-bold text-[#C84B31]">85%</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/5 backdrop-blur-sm text-center">
                <div className="text-xs text-[#EBE7DF]/50 mb-1">
                  {t.landing.feature3Review}
                </div>
                <div className="text-2xl font-bold text-white">
                  12
                  <span className="text-sm font-normal text-white/50 ml-1">
                    {t.landing.feature3Count}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#C84B31] opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* 4. Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-[#FDFBF7] border-y border-[#D8D3C8]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#2C241B] mb-4">
              {t.landing.pricingTitle}
            </h2>
            <p className="text-[#5D5548]">
              {t.landing.pricingDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#EBE7DF] rounded-3xl p-8 border border-[#D8D3C8] flex flex-col relative overflow-hidden">
              <div className="mb-4">
                <span className="text-sm font-bold text-[#5D5548] uppercase tracking-wider">
                  {t.landing.basicPlan}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-serif text-[#2C241B]">
                    {t.common.free}
                  </span>
                </div>
                <p className="text-[#5D5548] mt-2 text-sm">
                  {t.landing.basicDesc}
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-[#2C241B]">
                  <Check className="w-5 h-5 text-[#5D5548]" /> {t.landing.basicFeature1}
                </li>
                <li className="flex items-center gap-3 text-[#2C241B]">
                  <Check className="w-5 h-5 text-[#5D5548]" /> {t.landing.basicFeature2}
                </li>
                <li className="flex items-center gap-3 text-[#2C241B]">
                  <Check className="w-5 h-5 text-[#5D5548]" /> {t.landing.basicFeature3}
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl border border-[#2C241B]/20 text-[#2C241B] font-bold hover:bg-[#2C241B] hover:text-white transition-colors">
                {t.landing.startFree}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#2C241B] rounded-3xl p-8 border border-[#2C241B] flex flex-col relative text-[#EBE7DF] shadow-2xl scale-105 z-10">
              <div className="absolute top-0 right-0 bg-[#C84B31] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                {t.common.recommended}
              </div>
              <div className="mb-4">
                <span className="text-sm font-bold text-[#C84B31] uppercase tracking-wider">
                  {t.landing.proPlan}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-serif text-white">$9</span>
                  <span className="text-sm text-white/50">{t.common.perMonth}</span>
                </div>
                <p className="text-[#EBE7DF]/60 mt-2 text-sm">
                  {t.landing.proDesc}
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C84B31]" />{" "}
                  <strong>{t.landing.proFeature1}</strong>{t.landing.proFeature1Desc}
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C84B31]" />{" "}
                  <strong>{t.landing.proFeature2}</strong>{t.landing.proFeature2Desc}
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C84B31]" /> {t.landing.proFeature3}
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C84B31]" /> {t.landing.proFeature4}
                </li>
              </ul>

              <SubscribeButton />
            </div>
          </div>
        </div>
      </section>

      {/* 5. 앱 다운로드 섹션 */}
      <section id="app" className="py-32 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            {/* 텍스트 영역 */}
            <div className="flex-1 space-y-8 order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-serif text-[#2C241B] leading-tight">
                {t.landing.appTitle1}
                <br />
                <span className="text-[#C84B31]">{t.landing.appTitle2}</span>{t.landing.appTitle3}
              </h2>
              <p className="text-lg text-[#5D5548] leading-relaxed break-keep">
                {t.landing.appDesc1}
                <br />
                {t.landing.appDesc2}
              </p>

              <ul className="space-y-4">
                {[
                  t.landing.appFeature1,
                  t.landing.appFeature2,
                  t.landing.appFeature3,
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[#2C241B] font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#EBE7DF] flex items-center justify-center text-[#C84B31]">
                      <Check className="w-4 h-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex gap-4">
                <button className="flex items-center gap-3 bg-[#2C241B] text-white px-6 py-3 rounded-xl hover:bg-[#4A4036] transition-colors">
                  <Download className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase text-white/60 font-bold">
                      Download on the
                    </div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-[#2C241B] text-white px-6 py-3 rounded-xl hover:bg-[#4A4036] transition-colors">
                  <Download className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase text-white/60 font-bold">
                      Get it on
                    </div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 이미지 영역 (목업) */}
            <div className="flex-1 order-1 lg:order-2 w-full flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-[#C84B31] rounded-full blur-[100px] opacity-20"></div>
                <div className="relative w-72 h-[580px] bg-[#2C241B] rounded-[3rem] p-4 shadow-2xl border-4 border-[#4A4036]">
                  <div className="w-full h-full bg-[#FDFBF7] rounded-[2.5rem] overflow-hidden relative">
                    {/* 앱 화면 목업 (앱 내부 텍스트 수정) */}
                    <div className="bg-[#2C241B] text-white p-6 pb-10">
                      <div className="text-xs opacity-50 mb-1">REVIEW NOTE</div>
                      <div className="text-2xl font-serif">{t.landing.mockupReview}</div>
                    </div>
                    <div className="p-6">
                      <div className="w-full h-32 bg-[#EBE7DF] rounded-2xl mb-4 flex items-center justify-center text-[#5D5548] font-serif text-sm">
                        Grammar Question #24
                      </div>
                      <div className="space-y-3">
                        <div className="w-full h-12 bg-white border border-[#EBE7DF] rounded-xl flex items-center px-4 text-xs text-[#2C241B] justify-between">
                          <span>{t.landing.mockupCorrect}</span>
                          <span className="font-bold">A</span>
                        </div>
                        <div className="w-full h-12 bg-[#C84B31]/10 border border-[#C84B31] rounded-xl flex items-center px-4 text-xs text-[#C84B31] justify-between">
                          <span>{t.landing.mockupMyAnswer}</span>
                          <span className="font-bold">B</span>
                        </div>
                        <div className="w-full h-12 bg-white border border-[#EBE7DF] rounded-xl flex items-center px-4 text-xs text-[#5D5548]">
                          {t.landing.mockupViewExplanation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

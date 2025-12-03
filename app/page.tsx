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

export default function LandingPageSerene() {
  return (
    <div className="min-h-screen bg-[#EBE7DF] text-[#2C241B] font-sans selection:bg-[#C84B31] selection:text-white">
      {/* 1. 와이드 히어로 섹션 */}
      <header className="relative w-full h-screen min-h-[700px] flex flex-col justify-center items-center overflow-hidden px-4">
        {/* 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EBE7DF] via-[#EBE7DF] to-[#DFD8CC] z-0" />

        {/* 장식 요소 */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#2C241B]/10 -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 w-full h-[60vh] bg-[#C84B31]/5 blur-3xl -translate-y-1/2 z-0 rounded-full scale-x-150"></div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
          <div className="inline-block border border-[#2C241B] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#2C241B] mb-4">
            합격을 위한 실전과 분석
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-[#2C241B] leading-none">
            오답을 이해해야 <span className="italic text-[#C84B31]">합격</span>
            이
            <br />
            보입니다.
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl text-[#5D5548] leading-relaxed break-keep">
            단순히 정답만 맞추는 건 의미가 없습니다.
            <br />
            문장 단위 번역, 상세한 어휘 풀이, 그리고 오답 노트까지.
            <br />
            <span className="font-bold text-[#2C241B]">합격</span>으로 가는 가장
            확실한 길을 제시합니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button className="w-full sm:w-auto bg-[#C84B31] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#A63620] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C84B31]/20">
              <BookOpen className="w-5 h-5" />
              모의고사 풀러가기
            </button>
            <button className="w-full sm:w-auto bg-transparent border border-[#2C241B]/30 text-[#2C241B] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#2C241B] hover:text-white transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5" />
              해설 기능 미리보기
            </button>
          </div>
        </div>

        {/* 하단 스크롤 유도 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-[#2C241B]/40">
          <ArrowRight className="w-6 h-6 rotate-90" />
        </div>
      </header>

      {/* 2. Running Text (일본어로 변경하여 장식 효과) */}
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

      {/* 3. 핵심 기능 소개 (Features) */}
      <section
        id="features"
        className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="mb-16 border-b border-[#2C241B]/10 pb-8 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C241B] mb-4">
            취약점 정밀 진단
          </h2>
          <p className="text-[#5D5548] text-lg">
            문제를 푸는 시간보다,{" "}
            <span className="text-[#C84B31] font-bold">
              틀린 이유를 파악하는 시간
            </span>
            이 더 중요하니까요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1: 고퀄리티 해설 & 문장 번역 */}
          <div className="bg-[#FDFBF7] rounded-3xl p-8 border border-[#D8D3C8] hover:border-[#C84B31]/50 transition-colors group">
            <div className="w-12 h-12 bg-[#2C241B] rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif text-[#2C241B] mb-3">
              문장 단위 번역 & 상세 해설
            </h3>
            <p className="text-[#5D5548] leading-relaxed mb-6 break-keep">
              "이 문장이 왜 이렇게 해석되지?" 더 이상 번역기를 돌리지 마세요.
              모든 예문과 문제 지문에 대해 문장 단위의 정확한 한국어 번역과 문법
              포인트를 짚어드립니다.
            </p>
            <div className="bg-[#EBE7DF]/50 p-4 rounded-xl border border-[#D8D3C8]/50">
              <div className="text-sm text-[#2C241B]/60 mb-1 font-serif">
                예시
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
              자동 어휘 분석
            </h3>
            <p className="text-[#5D5548] leading-relaxed mb-6 break-keep">
              문제에 나온 모르는 단어, 일일이 사전 찾지 마세요. 해당 문제에
              포함된 핵심 단어와 요미가나, 뜻을 자동으로 정리해서 보여줍니다.
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
              <h3 className="text-3xl font-serif mb-4">스마트 오답 노트</h3>
              <p className="text-[#EBE7DF]/70 leading-relaxed mb-6 break-keep">
                틀린 문제는 자동으로 저장됩니다. 단순히 저장만 하는 것이 아니라,
                망각 곡선에 맞춰 다시 풀어볼 수 있도록 알림을 보냅니다. 내가
                약한 문법과 단어 유형만 골라 집중 공략하세요.
              </p>
              <button className="text-[#C84B31] font-bold hover:text-white transition-colors flex items-center gap-2">
                오답 노트 기능 더보기 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Visual Decoration */}
            <div className="relative z-10 grid grid-cols-2 gap-3 opacity-80">
              <div className="bg-white/10 p-4 rounded-xl border border-white/5 backdrop-blur-sm text-center">
                <div className="text-xs text-[#EBE7DF]/50 mb-1">정답률</div>
                <div className="text-2xl font-bold text-[#C84B31]">85%</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/5 backdrop-blur-sm text-center">
                <div className="text-xs text-[#EBE7DF]/50 mb-1">
                  복습할 문제
                </div>
                <div className="text-2xl font-bold text-white">
                  12
                  <span className="text-sm font-normal text-white/50 ml-1">
                    개
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
              이용권 안내
            </h2>
            <p className="text-[#5D5548]">
              합리적인 가격으로 합격의 지름길을 선택하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#EBE7DF] rounded-3xl p-8 border border-[#D8D3C8] flex flex-col relative overflow-hidden">
              <div className="mb-4">
                <span className="text-sm font-bold text-[#5D5548] uppercase tracking-wider">
                  Basic
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-serif text-[#2C241B]">
                    무료
                  </span>
                </div>
                <p className="text-[#5D5548] mt-2 text-sm">
                  가볍게 실력을 점검하고 싶은 분들을 위해
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-[#2C241B]">
                  <Check className="w-5 h-5 text-[#5D5548]" /> 매일 1회 미니
                  모의고사
                </li>
                <li className="flex items-center gap-3 text-[#2C241B]">
                  <Check className="w-5 h-5 text-[#5D5548]" /> 기본 정답 확인
                </li>
                <li className="flex items-center gap-3 text-[#2C241B]">
                  <Check className="w-5 h-5 text-[#5D5548]" /> 커뮤니티 접근
                  권한
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl border border-[#2C241B]/20 text-[#2C241B] font-bold hover:bg-[#2C241B] hover:text-white transition-colors">
                무료로 시작하기
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#2C241B] rounded-3xl p-8 border border-[#2C241B] flex flex-col relative text-[#EBE7DF] shadow-2xl scale-105 z-10">
              <div className="absolute top-0 right-0 bg-[#C84B31] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                추천
              </div>
              <div className="mb-4">
                <span className="text-sm font-bold text-[#C84B31] uppercase tracking-wider">
                  Pro
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-serif text-white">₩9,900</span>
                  <span className="text-sm text-white/50">/ 월</span>
                </div>
                <p className="text-[#EBE7DF]/60 mt-2 text-sm">
                  확실한 합격을 위한 모든 기능
                </p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C84B31]" />{" "}
                  <strong>무제한</strong> 데일리 문제
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C84B31]" />{" "}
                  <strong>무제한</strong> 실전 모의고사
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C84B31]" /> 문장별 상세 번역
                  & 해설
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C84B31]" /> 스마트 오답 노트
                  무제한 저장
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-[#C84B31] text-white font-bold hover:bg-[#A63620] transition-colors shadow-lg shadow-[#C84B31]/30">
                7일 무료 체험 시작하기
              </button>
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
                언제 어디서나,
                <br />
                <span className="text-[#C84B31]">당신의 리듬</span>대로.
              </h2>
              <p className="text-lg text-[#5D5548] leading-relaxed break-keep">
                웹에서 푼 모의고사 결과가 앱과 실시간 연동됩니다.
                <br />
                출퇴근길 지하철에서 오답 노트를 복습하세요.
              </p>

              <ul className="space-y-4">
                {[
                  "실시간 학습 진도 동기화",
                  "오프라인 모드 지원 (데이터 걱정 없이)",
                  "푸시 알림으로 복습 주기 관리",
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
                      <div className="text-2xl font-serif">취약점 분석</div>
                    </div>
                    <div className="p-6">
                      <div className="w-full h-32 bg-[#EBE7DF] rounded-2xl mb-4 flex items-center justify-center text-[#5D5548] font-serif text-sm">
                        Grammar Question #24
                      </div>
                      <div className="space-y-3">
                        <div className="w-full h-12 bg-white border border-[#EBE7DF] rounded-xl flex items-center px-4 text-xs text-[#2C241B] justify-between">
                          <span>정답 (正解)</span>
                          <span className="font-bold">A</span>
                        </div>
                        <div className="w-full h-12 bg-[#C84B31]/10 border border-[#C84B31] rounded-xl flex items-center px-4 text-xs text-[#C84B31] justify-between">
                          <span>나의 답안</span>
                          <span className="font-bold">B</span>
                        </div>
                        <div className="w-full h-12 bg-white border border-[#EBE7DF] rounded-xl flex items-center px-4 text-xs text-[#5D5548]">
                          해설 보기...
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

      {/* 6. 푸터 */}
      <footer className="bg-[#2C241B] text-[#EBE7DF]/60 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-[#EBE7DF] mb-8">
            JLPT MASTER
          </h2>
          <div className="flex justify-center gap-8 mb-12 text-sm font-medium">
            <Link href="#" className="hover:text-white">
              서비스 소개
            </Link>
            <Link href="#features" className="hover:text-white">
              주요 기능
            </Link>
            <Link href="#pricing" className="hover:text-white">
              요금제
            </Link>
            <Link href="#" className="hover:text-white">
              문의하기
            </Link>
          </div>
          <p className="text-xs">
            © 2025 JLPT Master Inc. All rights reserved.{" "}
            <br className="sm:hidden" /> Designed for calm learning.
          </p>
        </div>
      </footer>
    </div>
  );
}

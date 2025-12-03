"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Languages,
  Glasses,
  Ear,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// 선택 옵션 데이터 정의
const LEVELS = [
  { id: "1", label: "N1", desc: "고급" },
  { id: "2", label: "N2", desc: "상급" },
  { id: "3", label: "N3", desc: "중급" },
  { id: "4", label: "N4", desc: "기초" },
  { id: "5", label: "N5", desc: "입문" },
];

const TYPES = [
  {
    id: "vocab",
    label: "문자 어휘",
    icon: <Languages className="w-5 h-5" />,
    desc: "한자 읽기, 표기, 문맥 규정",
  },
  {
    id: "grammar",
    label: "문법",
    icon: <BookOpen className="w-5 h-5" />,
    desc: "문법 형식, 문장 만들기",
  },
  {
    id: "reading",
    label: "독해",
    icon: <Glasses className="w-5 h-5" />,
    desc: "단문, 중문, 장문 독해",
  },
  {
    id: "listening",
    label: "청해",
    icon: <Ear className="w-5 h-5" />,
    desc: "과제 이해, 포인트 이해",
  },
];

export default function PracticePage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleStart = () => {
    if (!selectedLevel || !selectedType) return;

    // 선택된 값을 쿼리 파라미터로 넘기며 문제 풀이 페이지로 이동
    // (이후 구현할 페이지 경로: /practice/solve)
    router.push(`/practice/solve?level=${selectedLevel}&type=${selectedType}`);
  };

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 1. 헤더 영역 */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C84B31]/10 text-[#C84B31] px-4 py-1.5 rounded-full text-sm font-bold border border-[#C84B31]/20">
            <Sparkles className="w-4 h-4" />
            <span>Daily Practice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C241B]">
            오늘의 학습을 설정하세요
          </h1>
          <p className="text-[#5D5548] text-lg">
            하루 한 문제라도 꾸준히. <br className="sm:hidden" />
            작은 성취가 모여 합격을 만듭니다.
          </p>
        </div>

        {/* 2. 메인 설정 카드 */}
        <div className="bg-[#FDFBF7] rounded-[2rem] shadow-xl border border-[#D8D3C8] p-6 md:p-10 relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C84B31] opacity-[0.03] rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="relative z-10 space-y-10">
            {/* Step 1: 급수 선택 */}
            <section>
              <h2 className="text-xl font-serif text-[#2C241B] mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2C241B] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                도전할 급수 (Level)
              </h2>
              <div className="grid grid-cols-5 gap-3 sm:gap-4">
                {LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`
                      relative group flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200
                      ${
                        selectedLevel === level.id
                          ? "border-[#C84B31] bg-[#C84B31] text-white shadow-lg shadow-[#C84B31]/30 scale-105"
                          : "border-[#D8D3C8] bg-white text-[#5D5548] hover:border-[#C84B31] hover:text-[#C84B31]"
                      }
                    `}
                  >
                    <span className="text-xl font-black font-serif">
                      {level.label}
                    </span>
                    <span
                      className={`text-[10px] mt-1 font-medium ${
                        selectedLevel === level.id
                          ? "text-white/80"
                          : "text-[#5D5548]/60"
                      }`}
                    >
                      {level.desc}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <div className="w-full h-[1px] bg-[#D8D3C8]/50"></div>

            {/* Step 2: 유형 선택 */}
            <section>
              <h2 className="text-xl font-serif text-[#2C241B] mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2C241B] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                학습 유형 (Subject)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left
                      ${
                        selectedType === type.id
                          ? "border-[#C84B31] bg-[#FFF5F2] ring-1 ring-[#C84B31]"
                          : "border-[#D8D3C8] bg-white hover:border-[#C84B31]/50 hover:bg-[#FAFAF8]"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                      ${
                        selectedType === type.id
                          ? "bg-[#C84B31] text-white"
                          : "bg-[#F5F5F0] text-[#5D5548]"
                      }
                    `}
                    >
                      {type.icon}
                    </div>
                    <div>
                      <div
                        className={`font-bold text-lg ${
                          selectedType === type.id
                            ? "text-[#C84B31]"
                            : "text-[#2C241B]"
                        }`}
                      >
                        {type.label}
                      </div>
                      <div className="text-xs text-[#5D5548] mt-0.5">
                        {type.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: 시작 버튼 */}
            <div className="pt-4">
              <button
                disabled={!selectedLevel || !selectedType}
                onClick={handleStart}
                className={`
                  w-full py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300
                  ${
                    !selectedLevel || !selectedType
                      ? "bg-[#D8D3C8] text-[#FDFBF7] cursor-not-allowed"
                      : "bg-[#2C241B] text-white hover:bg-[#C84B31] shadow-xl hover:shadow-[#C84B31]/30 transform hover:-translate-y-1"
                  }
                `}
              >
                {!selectedLevel || !selectedType ? (
                  "옵션을 선택해주세요"
                ) : (
                  <>
                    학습 시작하기 <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 하단 팁 */}
        <p className="text-center text-[#5D5548]/60 text-sm mt-8">
          Tip: 모의고사(Mock Exam)는 시간을 재면서 전체 영역을 응시하는
          모드입니다.
        </p>
      </div>
    </div>
  );
}

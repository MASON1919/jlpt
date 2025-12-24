"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PenTool,
  Clock,
  FileText,
  ChevronRight,
  Lock,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const MOCK_EXAMS = [
  {
    id: 1,
    level: "1",
    title: "2024년 1회 실전 모의고사",
    titleEn: "2024 Session 1 Mock Exam",
    year: "2024",
    time: 170,
    status: "new",
    score: null,
  },
  {
    id: 2,
    level: "1",
    title: "2023년 2회 기출 변형",
    titleEn: "2023 Session 2 Modified",
    year: "2023",
    time: 170,
    status: "completed",
    score: { total: 145, max: 180, passed: true },
  },
  {
    id: 3,
    level: "1",
    title: "2023년 1회 기출 변형",
    titleEn: "2023 Session 1 Modified",
    year: "2023",
    time: 170,
    status: "locked",
    score: null,
  },
  {
    id: 4,
    level: "2",
    title: "2024년 대비 N2 하프 모의고사",
    titleEn: "2024 N2 Half Mock Exam",
    year: "2024",
    time: 105,
    status: "new",
    score: null,
  },
];

const LEVELS = [
  { id: "1", label: "N1" },
  { id: "2", label: "N2" },
  { id: "3", label: "N3" },
  { id: "4", label: "N4" },
  { id: "5", label: "N5" },
];

export default function ExamPage() {
  const [currentLevel, setCurrentLevel] = useState("1");
  const { t, language } = useLanguage();

  // 선택된 레벨의 시험지만 필터링
  const filteredExams = MOCK_EXAMS.filter(
    (exam) => exam.level === currentLevel
  );

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 1. 헤더 영역 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#2C241B] text-[#FDFBF7] px-4 py-1.5 rounded-full text-sm font-bold">
              <PenTool className="w-4 h-4" />
              <span>Real Simulation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2C241B]">
              {t.exam.title}
            </h1>
            <p className="text-[#5D5548] text-lg max-w-xl">
              {t.exam.desc1}
              <br className="hidden sm:block" />
              {t.exam.desc2}
            </p>
          </div>

          {/* 급수 선택 탭 (Practice와 다르게 심플한 탭 형태) */}
          <div className="bg-[#FDFBF7] p-1.5 rounded-xl border border-[#D8D3C8] inline-flex shadow-sm">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setCurrentLevel(level.id)}
                className={`
                  px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                  ${
                    currentLevel === level.id
                      ? "bg-[#2C241B] text-white shadow-md"
                      : "text-[#5D5548] hover:bg-[#EBE7DF] hover:text-[#2C241B]"
                  }
                `}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 주의사항 박스 */}
        <div className="bg-[#FFF5F2] border border-[#C84B31]/20 rounded-2xl p-6 mb-10 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#C84B31] flex-shrink-0 mt-1" />
          <div className="text-sm text-[#2C241B]">
            <strong className="block text-base font-bold text-[#C84B31] mb-1">
              {t.exam.warningTitle}
            </strong>
            {t.exam.warningDesc}{" "}
            <strong>{t.exam.warningSubjects}</strong>
            {t.exam.warningEnd}
          </div>
        </div>

        {/* 3. 시험지 리스트 (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <div
                key={exam.id}
                className={`
                  group relative bg-[#FDFBF7] rounded-3xl p-8 border transition-all duration-300
                  ${
                    exam.status === "locked"
                      ? "border-[#D8D3C8] opacity-80"
                      : "border-[#D8D3C8] hover:border-[#C84B31] hover:shadow-xl hover:shadow-[#C84B31]/10"
                  }
                `}
              >
                {/* 상단 뱃지 (년도) */}
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#EBE7DF] text-[#5D5548] px-3 py-1 rounded-lg text-xs font-bold font-serif">
                    {exam.year} Season
                  </span>
                  {exam.status === "completed" && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        exam.score?.passed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {exam.score?.passed ? t.exam.passed : t.exam.failed}
                    </span>
                  )}
                </div>

                {/* 타이틀 */}
                <h3 className="text-2xl font-serif text-[#2C241B] mb-2 group-hover:text-[#C84B31] transition-colors">
                  {language === "ko" ? exam.title : exam.titleEn}
                </h3>

                {/* 메타 정보 */}
                <div className="flex items-center gap-4 text-sm text-[#5D5548] mb-8">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {exam.time}min
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {t.exam.allSubjects}
                  </div>
                </div>

                {/* 하단 액션 버튼 분기 */}
                <div className="border-t border-[#D8D3C8] pt-6 flex items-center justify-between">
                  {exam.status === "locked" ? (
                    // 🔒 잠김 상태
                    <>
                      <div className="flex items-center gap-2 text-[#5D5548]">
                        <Lock className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {t.exam.proOnly}
                        </span>
                      </div>
                      <button className="text-xs bg-[#2C241B] text-white px-4 py-2 rounded-full hover:bg-[#C84B31] transition-colors">
                        {t.common.upgrade}
                      </button>
                    </>
                  ) : exam.status === "completed" ? (
                    // 🏆 완료 상태 (점수 표시)
                    <>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5D5548]">Score</span>
                        <span className="text-xl font-bold font-serif text-[#2C241B]">
                          {exam.score?.total}{" "}
                          <span className="text-sm text-[#5D5548] font-normal">
                            / {exam.score?.max}
                          </span>
                        </span>
                      </div>
                      <Link
                        href={`/exam/result/${exam.id}`}
                        className="flex items-center gap-2 text-[#C84B31] font-bold text-sm hover:underline"
                      >
                        {t.common.viewResult} <ChevronRight className="w-4 h-4" />
                      </Link>
                    </>
                  ) : (
                    // ▶️ 응시 가능 상태
                    <Link href={`/exam/start/${exam.id}`} className="w-full">
                      <button className="w-full bg-[#2C241B] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#C84B31] transition-colors shadow-lg">
                        {t.exam.startExam}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            // 데이터 없을 때 Empty State
            <div className="col-span-1 md:col-span-2 py-20 text-center border-2 border-dashed border-[#D8D3C8] rounded-3xl">
              <Trophy className="w-12 h-12 text-[#D8D3C8] mx-auto mb-4" />
              <p className="text-[#5D5548] font-medium">
                {t.exam.noExamsAvailable}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

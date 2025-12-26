"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PenTool,
  Clock,
  FileText,
  ChevronRight,
  Trophy,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface MockExam {
  id: number;
  level: number;
  title: string;
  createdAt: string;
  _count: { problems: number };
}

const LEVELS = [
  { id: 1, label: "N1" },
  { id: 2, label: "N2" },
  { id: 3, label: "N3" },
  { id: 4, label: "N4" },
  { id: 5, label: "N5" },
];

export default function ExamPage() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/mockexams?level=${currentLevel}`);
        if (res.ok) {
          const data = await res.json();
          setMockExams(data.mockExams);
        }
      } catch (error) {
        console.error("Failed to fetch mock exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [currentLevel]);

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

          {/* 급수 선택 탭 */}
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
          {loading ? (
            <div className="col-span-1 md:col-span-2 py-20 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#C84B31] animate-spin" />
            </div>
          ) : mockExams.length > 0 ? (
            mockExams.map((exam) => (
              <div
                key={exam.id}
                className="group relative bg-[#FDFBF7] rounded-3xl p-8 border transition-all duration-300 border-[#D8D3C8] hover:border-[#C84B31] hover:shadow-xl hover:shadow-[#C84B31]/10"
              >
                {/* 상단 뱃지 */}
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#C84B31] text-white px-3 py-1 rounded-lg text-xs font-bold">
                    N{exam.level}
                  </span>
                  <span className="text-xs text-[#5D5548]">
                    {exam._count.problems}{language === "ko" ? "문제" : " problems"}
                  </span>
                </div>

                {/* 타이틀 */}
                <h3 className="text-2xl font-serif text-[#2C241B] mb-2 group-hover:text-[#C84B31] transition-colors">
                  {exam.title}
                </h3>

                {/* 메타 정보 */}
                <div className="flex items-center gap-4 text-sm text-[#5D5548] mb-8">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {exam._count.problems * 2}min
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {t.exam.allSubjects}
                  </div>
                </div>

                {/* 하단 액션 버튼 */}
                <div className="border-t border-[#D8D3C8] pt-6">
                  <Link href={`/exam/solve/${exam.id}`} className="w-full block">
                    <button className="w-full bg-[#2C241B] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#C84B31] transition-colors shadow-lg">
                      {t.exam.startExam}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </Link>
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

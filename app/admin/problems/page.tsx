"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Languages,
  BookOpen,
  Glasses,
  Ear,
  ChevronRight,
  Loader2,
} from "lucide-react";

const LEVELS = [
  { id: 1, label: "N1" },
  { id: 2, label: "N2" },
  { id: 3, label: "N3" },
  { id: 4, label: "N4" },
  { id: 5, label: "N5" },
];

const TYPES = [
  { id: "VOCAB", label: "문자/어휘", icon: Languages },
  { id: "GRAMMAR", label: "문법", icon: BookOpen },
  { id: "READING", label: "독해", icon: Glasses },
  { id: "LISTENING", label: "청해", icon: Ear },
];

interface Problem {
  id: number;
  level: number;
  type: string;
  subType: string;
  content: string;
  question: string;
  createdAt: string;
}

export default function ProblemListPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>("VOCAB");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/problems?level=${selectedLevel}&type=${selectedType}`);
      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedLevel, selectedType]);

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#D8D3C8] hover:border-[#C84B31] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#5D5548]" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#2C241B]">
              문제 목록
            </h1>
            <p className="text-[#5D5548] text-sm">급수와 유형을 선택하세요.</p>
          </div>
        </div>

        {/* Level Selection */}
        <div className="mb-6">
          <div className="text-sm font-bold text-[#2C241B] mb-3">급수 선택</div>
          <div className="flex gap-2">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  selectedLevel === level.id
                    ? "bg-[#C84B31] text-white shadow-lg"
                    : "bg-white text-[#5D5548] border border-[#D8D3C8] hover:border-[#C84B31]"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type Selection */}
        <div className="mb-8">
          <div className="text-sm font-bold text-[#2C241B] mb-3">유형 선택</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedType === type.id
                      ? "bg-[#2C241B] text-white"
                      : "bg-white text-[#5D5548] border border-[#D8D3C8] hover:border-[#2C241B]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Problem List */}
        <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] overflow-hidden">
          <div className="bg-[#2C241B] text-white px-6 py-3 flex justify-between items-center">
            <span className="font-medium">
              N{selectedLevel} · {TYPES.find(t => t.id === selectedType)?.label}
            </span>
            <span className="text-sm text-white/70">총 {totalCount}개</span>
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#C84B31] animate-spin" />
            </div>
          ) : problems.length === 0 ? (
            <div className="py-20 text-center text-[#5D5548]">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>해당 조건의 문제가 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D8D3C8]">
              {problems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => router.push(`/admin/problems/${problem.id}`)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#EBE7DF]/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-[#EBE7DF] rounded text-[#5D5548]">
                        #{problem.id}
                      </span>
                      <span className="text-xs text-[#5D5548]">
                        {problem.subType}
                      </span>
                    </div>
                    <p className="text-[#2C241B] truncate font-medium" 
                       dangerouslySetInnerHTML={{ __html: problem.content || problem.question || "내용 없음" }} 
                    />
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#D8D3C8] flex-shrink-0 ml-4" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

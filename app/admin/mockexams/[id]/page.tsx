"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Trash2,
  Plus,
  X,
  Languages,
  BookOpen,
  Glasses,
  Ear,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

const PROBLEM_TYPES = [
  { id: "VOCAB", label: "문자/어휘", icon: Languages },
  { id: "GRAMMAR", label: "문법", icon: BookOpen },
  { id: "READING", label: "독해", icon: Glasses },
  { id: "LISTENING", label: "청해", icon: Ear },
];

const PROBLEM_SUB_TYPES: Record<string, string[]> = {
  VOCAB: ["KANJI_READING", "ORTHOGRAPHY", "WORD_FORMATION", "CONTEXT", "PARAPHRASE", "USAGE"],
  GRAMMAR: ["GRAMMAR_FORM", "GRAMMAR_ORDER", "TEXT_GRAMMAR"],
  READING: ["SHORT_PASSAGE", "MID_PASSAGE", "LONG_PASSAGE", "INTEGRATED_PASSAGE", "THEMATIC_PASSAGE", "INFO_RETRIEVAL"],
  LISTENING: ["TASK_BASED", "POINT_COMPREHENSION", "SUMMARY", "QUICK_RESPONSE", "INTEGRATED_COMPREHENSION"],
};

interface Problem {
  id: number;
  level: number;
  type: string;
  subType: string;
  content: string;
  question: string;
}

interface MockExam {
  id: number;
  title: string;
  level: number;
  problems: Problem[];
}

interface AvailableProblem {
  id: number;
  type: string;
  subType: string;
  content: string;
  question: string;
}

export default function MockExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [mockExam, setMockExam] = useState<MockExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Problem selection state
  const [showAddProblems, setShowAddProblems] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("VOCAB");
  const [selectedSubType, setSelectedSubType] = useState<string>("");
  const [availableProblems, setAvailableProblems] = useState<AvailableProblem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [expandedType, setExpandedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchMockExam = async () => {
      try {
        const res = await fetch(`/api/admin/mockexams/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setMockExam(data.mockExam);
        } else {
          setError("모의고사를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMockExam();
  }, [resolvedParams.id]);

  const fetchAvailableProblems = async () => {
    if (!mockExam) return;
    setLoadingProblems(true);
    
    try {
      // excludeAssigned=true ensures we only get problems not assigned to any mock exam
      const res = await fetch(`/api/admin/problems?level=${mockExam.level}&type=${selectedType}&excludeAssigned=true`);
      if (res.ok) {
        const data = await res.json();
        setAvailableProblems(data.problems);
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoadingProblems(false);
    }
  };

  useEffect(() => {
    if (showAddProblems && mockExam) {
      fetchAvailableProblems();
    }
  }, [showAddProblems, selectedType, mockExam]);

  const handleAddProblem = async (problemId: number) => {
    try {
      const res = await fetch(`/api/admin/problems/${problemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockExamId: parseInt(resolvedParams.id) }),
      });

      if (res.ok) {
        // Refresh mock exam data
        const examRes = await fetch(`/api/admin/mockexams/${resolvedParams.id}`);
        if (examRes.ok) {
          const data = await examRes.json();
          setMockExam(data.mockExam);
        }
        // Remove from available list
        setAvailableProblems(prev => prev.filter(p => p.id !== problemId));
      }
    } catch (error) {
      console.error("Failed to add problem:", error);
    }
  };

  const handleRemoveProblem = async (problemId: number) => {
    try {
      const res = await fetch(`/api/admin/problems/${problemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockExamId: null }),
      });

      if (res.ok) {
        setMockExam(prev => prev ? {
          ...prev,
          problems: prev.problems.filter(p => p.id !== problemId),
        } : null);
      }
    } catch (error) {
      console.error("Failed to remove problem:", error);
    }
  };

  const handleDelete = async () => {
    if (!mockExam || !confirm("정말로 이 모의고사를 삭제하시겠습니까?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/mockexams/${mockExam.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/mockexams");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      setDeleting(false);
    }
  };

  // Group problems by type
  const problemsByType = mockExam?.problems.reduce((acc, problem) => {
    if (!acc[problem.type]) acc[problem.type] = [];
    acc[problem.type].push(problem);
    return acc;
  }, {} as Record<string, Problem[]>) || {};

  // Calculate JLPT-style problem numbers (cumulative across types)
  const getProblemNumbers = () => {
    if (!mockExam) return {};
    const numbers: Record<number, number> = {};
    let currentNumber = 1;
    
    PROBLEM_TYPES.forEach(typeInfo => {
      const problems = problemsByType[typeInfo.id] || [];
      // Sort by subType to maintain consistent order
      const sortedProblems = [...problems].sort((a, b) => {
        const subTypeOrder = PROBLEM_SUB_TYPES[typeInfo.id] || [];
        return subTypeOrder.indexOf(a.subType) - subTypeOrder.indexOf(b.subType);
      });
      sortedProblems.forEach(p => {
        numbers[p.id] = currentNumber++;
      });
    });
    
    return numbers;
  };
  
  const problemNumbers = getProblemNumbers();

  // Group available problems by subType
  const availableBySubType = availableProblems.reduce((acc, problem) => {
    if (!acc[problem.subType]) acc[problem.subType] = [];
    acc[problem.subType].push(problem);
    return acc;
  }, {} as Record<string, AvailableProblem[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C84B31] animate-spin" />
      </div>
    );
  }

  if (error || !mockExam) {
    return (
      <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/admin/mockexams" className="text-[#C84B31] hover:underline">
            ← 모의고사 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/mockexams"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#D8D3C8] hover:border-[#C84B31] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#5D5548]" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#C84B31] text-white rounded text-xs font-bold">
                  N{mockExam.level}
                </span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#2C241B]">
                {mockExam.title}
              </h1>
              <p className="text-[#5D5548] text-sm">{mockExam.problems.length}개 문제</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddProblems(!showAddProblems)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
                showAddProblems
                  ? "bg-[#2C241B] text-white"
                  : "bg-[#C84B31] text-white hover:bg-[#A63620]"
              }`}
            >
              {showAddProblems ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddProblems ? "닫기" : "문제 추가"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              삭제
            </button>
          </div>
        </div>

        {/* Add Problems Panel */}
        {showAddProblems && (
          <div className="bg-white rounded-2xl border border-[#D8D3C8] p-6 mb-6">
            <h3 className="text-lg font-bold text-[#2C241B] mb-4">문제 추가</h3>
            
            {/* Type Selection */}
            <div className="flex gap-2 mb-4">
              {PROBLEM_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedType === type.id
                        ? "bg-[#2C241B] text-white"
                        : "bg-[#EBE7DF] text-[#5D5548] hover:bg-[#D8D3C8]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>

            {/* Available Problems by SubType */}
            {loadingProblems ? (
              <div className="py-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#C84B31] animate-spin" />
              </div>
            ) : Object.keys(availableBySubType).length === 0 ? (
              <div className="py-8 text-center text-[#5D5548]">
                추가 가능한 문제가 없습니다.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {PROBLEM_SUB_TYPES[selectedType]?.map((subType) => {
                  const problems = availableBySubType[subType] || [];
                  if (problems.length === 0) return null;
                  
                  return (
                    <div key={subType} className="border border-[#D8D3C8] rounded-xl overflow-hidden">
                      <button
                        onClick={() => setSelectedSubType(selectedSubType === subType ? "" : subType)}
                        className="w-full px-4 py-3 bg-[#FDFBF7] flex items-center justify-between hover:bg-[#EBE7DF] transition-colors"
                      >
                        <span className="font-medium text-[#2C241B]">{subType}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#5D5548]">{problems.length}개</span>
                          {selectedSubType === subType ? (
                            <ChevronUp className="w-4 h-4 text-[#5D5548]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#5D5548]" />
                          )}
                        </div>
                      </button>
                      
                      {selectedSubType === subType && (
                        <div className="divide-y divide-[#D8D3C8]">
                          {problems.map((problem) => (
                            <div
                              key={problem.id}
                              className="px-4 py-3 flex items-center justify-between hover:bg-[#FDFBF7]"
                            >
                              <div className="flex-1 min-w-0">
                                <span className="text-xs text-[#5D5548]">#{problem.id}</span>
                                <p 
                                  className="text-sm text-[#2C241B] truncate"
                                  dangerouslySetInnerHTML={{ __html: problem.content || problem.question }}
                                />
                              </div>
                              <button
                                onClick={() => handleAddProblem(problem.id)}
                                className="ml-2 px-3 py-1 bg-[#C84B31] text-white rounded-lg text-sm font-medium hover:bg-[#A63620] transition-colors"
                              >
                                추가
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Current Problems by Type */}
        <div className="space-y-4">
          {PROBLEM_TYPES.map((typeInfo) => {
            const problems = problemsByType[typeInfo.id] || [];
            const Icon = typeInfo.icon;
            const isExpanded = expandedType === typeInfo.id;
            
            return (
              <div key={typeInfo.id} className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] overflow-hidden">
                <button
                  onClick={() => setExpandedType(isExpanded ? null : typeInfo.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#EBE7DF]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2C241B] rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-[#2C241B]">{typeInfo.label}</h3>
                      <p className="text-sm text-[#5D5548]">{problems.length}개 문제</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#5D5548]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5D5548]" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-4">
                    {problems.length === 0 ? (
                      <p className="text-center text-[#5D5548] py-4">문제 없음</p>
                    ) : (
                      <div className="space-y-2">
                        {problems.map((problem) => (
                          <div
                            key={problem.id}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#D8D3C8]"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-[#C84B31]">
                                  問{problemNumbers[problem.id]}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-[#EBE7DF] rounded text-[#5D5548]">
                                  #{problem.id}
                                </span>
                                <span className="text-xs text-[#5D5548]">{problem.subType}</span>
                              </div>
                              <p 
                                className="text-sm text-[#2C241B] truncate"
                                dangerouslySetInnerHTML={{ __html: problem.content || problem.question }}
                              />
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Link
                                href={`/admin/problems/${problem.id}`}
                                className="text-xs text-[#C84B31] hover:underline"
                              >
                                편집
                              </Link>
                              <button
                                onClick={() => handleRemoveProblem(problem.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

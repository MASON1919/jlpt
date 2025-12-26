"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Trash2,
  Check,
  BookOpen,
  Plus,
  X,
  Eye,
} from "lucide-react";

const PROBLEM_TYPES = ["VOCAB", "GRAMMAR", "READING", "LISTENING"];
const PROBLEM_SUB_TYPES = [
  "KANJI_READING",
  "ORTHOGRAPHY",
  "WORD_FORMATION",
  "CONTEXT",
  "PARAPHRASE",
  "USAGE",
  "GRAMMAR_FORM",
  "GRAMMAR_ORDER",
  "TEXT_GRAMMAR",
  "SHORT_PASSAGE",
  "MID_PASSAGE",
  "LONG_PASSAGE",
  "INTEGRATED_PASSAGE",
  "THEMATIC_PASSAGE",
  "INFO_RETRIEVAL",
  "TASK_BASED",
  "POINT_COMPREHENSION",
  "SUMMARY",
  "QUICK_RESPONSE",
  "INTEGRATED_COMPREHENSION",
];

interface Vocab {
  word: string;
  reading: string;
  meaning: { ko: string; en?: string };
}

interface MockExam {
  id: number;
  title: string;
  _count?: { problems: number };
}

interface Problem {
  id: number;
  level: number;
  type: string;
  subType: string;
  content: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: { ko: string; en?: string };
  vocab?: Vocab[];
  reasoning_for_level?: string;
  mockExamId?: number | null;
  mockExam?: { id: number; title: string } | null;
}

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemRes, mockExamRes] = await Promise.all([
          fetch(`/api/admin/problems/${resolvedParams.id}`),
          fetch("/api/admin/mockexams"),
        ]);

        if (problemRes.ok) {
          const data = await problemRes.json();
          setProblem(data.problem);
        } else {
          setError("문제를 찾을 수 없습니다.");
        }

        if (mockExamRes.ok) {
          const data = await mockExamRes.json();
          setMockExams(data.mockExams);
        }
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const updateProblem = (updates: Partial<Problem>) => {
    if (!problem) return;
    setProblem({ ...problem, ...updates });
    setSaveSuccess(false);
  };

  const updateOption = (index: number, value: string) => {
    if (!problem) return;
    const newOptions = [...problem.options];
    newOptions[index] = value;
    updateProblem({ options: newOptions });
  };

  const updateVocab = (
    index: number,
    field: "word" | "reading" | "meaning_ko" | "meaning_en",
    value: string
  ) => {
    if (!problem || !problem.vocab) return;
    const newVocab = [...problem.vocab];
    if (field === "meaning_ko") {
      newVocab[index] = {
        ...newVocab[index],
        meaning: { ...newVocab[index].meaning, ko: value },
      };
    } else if (field === "meaning_en") {
      newVocab[index] = {
        ...newVocab[index],
        meaning: { ...newVocab[index].meaning, en: value },
      };
    } else {
      newVocab[index] = { ...newVocab[index], [field]: value };
    }
    updateProblem({ vocab: newVocab });
  };

  const addVocab = () => {
    if (!problem) return;
    const newVocab = [
      ...(problem.vocab || []),
      { word: "", reading: "", meaning: { ko: "", en: "" } },
    ];
    updateProblem({ vocab: newVocab });
  };

  const removeVocab = (index: number) => {
    if (!problem || !problem.vocab) return;
    const newVocab = problem.vocab.filter((_, i) => i !== index);
    updateProblem({ vocab: newVocab });
  };

  const handleSave = async () => {
    if (!problem) return;
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/problems/${problem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problem),
      });

      if (!response.ok) {
        throw new Error("저장 실패");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 중 오류 발생");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!problem || !confirm("정말로 이 문제를 삭제하시겠습니까?")) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/problems/${problem.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제 실패");
      }

      router.push("/admin/problems");
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 중 오류 발생");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C84B31] animate-spin" />
      </div>
    );
  }

  if (error && !problem) {
    return (
      <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/admin/problems" className="text-[#C84B31] hover:underline">
            ← 문제 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/problems"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#D8D3C8] hover:border-[#C84B31] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#5D5548]" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#2C241B]">
                문제 #{problem.id} 편집
              </h1>
              <p className="text-[#5D5548] text-sm">수정 후 저장 버튼을 눌러주세요.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/practice/solve?problemId=${problem.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-[#2C241B] text-white rounded-xl hover:bg-[#5D5548] transition-colors"
            >
              <Eye className="w-4 h-4" />
              미리보기
            </Link>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level/Type/SubType */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-xs text-[#5D5548] block mb-1">Level</label>
                  <select
                    value={problem.level}
                    onChange={(e) => updateProblem({ level: parseInt(e.target.value) })}
                    className="px-3 py-2 bg-[#C84B31] text-white rounded-lg font-bold"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>N{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#5D5548] block mb-1">Type</label>
                  <select
                    value={problem.type}
                    onChange={(e) => updateProblem({ type: e.target.value })}
                    className="px-3 py-2 bg-[#2C241B] text-white rounded-lg"
                  >
                    {PROBLEM_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#5D5548] block mb-1">SubType</label>
                  <select
                    value={problem.subType}
                    onChange={(e) => updateProblem({ subType: e.target.value })}
                    className="px-3 py-2 bg-[#5D5548] text-white rounded-lg"
                  >
                    {PROBLEM_SUB_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
              <label className="text-sm font-bold text-[#2C241B] block mb-2">지문</label>
              <textarea
                value={problem.content}
                onChange={(e) => updateProblem({ content: e.target.value })}
                className="w-full p-3 bg-white rounded-xl border border-[#D8D3C8] focus:outline-none focus:border-[#C84B31] resize-none font-serif text-lg"
                rows={4}
              />
            </div>

            {/* Question */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
              <label className="text-sm font-bold text-[#2C241B] block mb-2">문제</label>
              <textarea
                value={problem.question}
                onChange={(e) => updateProblem({ question: e.target.value })}
                className="w-full p-3 bg-white rounded-xl border border-[#D8D3C8] focus:outline-none focus:border-[#C84B31] resize-none"
                rows={2}
              />
            </div>

            {/* Options */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
              <label className="text-sm font-bold text-[#2C241B] block mb-3">
                보기 (클릭하여 정답 선택)
              </label>
              <div className="space-y-2">
                {problem.options.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => updateProblem({ answerIndex: idx })}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      idx === problem.answerIndex
                        ? "border-green-500 bg-green-50"
                        : "border-[#D8D3C8] bg-white hover:border-[#5D5548]"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === problem.answerIndex
                          ? "bg-green-500 text-white"
                          : "bg-[#EBE7DF] text-[#5D5548]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateOption(idx, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-transparent focus:outline-none text-lg"
                    />
                    {idx === problem.answerIndex && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
              <label className="text-sm font-bold text-[#2C241B] block mb-2">해설</label>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-[#5D5548]">한국어</span>
                  <textarea
                    value={problem.explanation?.ko || ""}
                    onChange={(e) =>
                      updateProblem({
                        explanation: { ...problem.explanation, ko: e.target.value },
                      })
                    }
                    className="w-full p-3 bg-blue-50 rounded-xl border border-blue-200 focus:outline-none focus:border-blue-400 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <span className="text-xs text-[#5D5548]">영어 (선택)</span>
                  <textarea
                    value={problem.explanation?.en || ""}
                    onChange={(e) =>
                      updateProblem({
                        explanation: { ...problem.explanation, en: e.target.value },
                      })
                    }
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Vocab */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-[#2C241B]">주요 단어</label>
                <button
                  onClick={addVocab}
                  className="text-xs flex items-center gap-1 text-[#C84B31] hover:underline"
                >
                  <Plus className="w-3 h-3" /> 추가
                </button>
              </div>
              <div className="space-y-3">
                {problem.vocab?.map((v, i) => (
                  <div key={i} className="bg-[#EBE7DF] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#5D5548]">단어 #{i + 1}</span>
                      <button
                        onClick={() => removeVocab(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="단어"
                        value={v.word}
                        onChange={(e) => updateVocab(i, "word", e.target.value)}
                        className="px-2 py-1 rounded bg-white text-sm focus:outline-none"
                      />
                      <input
                        placeholder="읽기"
                        value={v.reading}
                        onChange={(e) => updateVocab(i, "reading", e.target.value)}
                        className="px-2 py-1 rounded bg-white text-sm focus:outline-none"
                      />
                      <input
                        placeholder="뜻 (KO)"
                        value={v.meaning.ko}
                        onChange={(e) => updateVocab(i, "meaning_ko", e.target.value)}
                        className="px-2 py-1 rounded bg-white text-sm focus:outline-none"
                      />
                      <input
                        placeholder="뜻 (EN)"
                        value={v.meaning.en || ""}
                        onChange={(e) => updateVocab(i, "meaning_en", e.target.value)}
                        className="px-2 py-1 rounded bg-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
                {(!problem.vocab || problem.vocab.length === 0) && (
                  <div className="text-center text-[#5D5548] text-sm py-4">
                    단어 없음
                  </div>
                )}
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
              <label className="text-sm font-bold text-[#2C241B] block mb-2">
                급수 적합성 이유 (선택)
              </label>
              <textarea
                value={problem.reasoning_for_level || ""}
                onChange={(e) => updateProblem({ reasoning_for_level: e.target.value })}
                className="w-full p-3 bg-white rounded-xl border border-[#D8D3C8] focus:outline-none focus:border-[#C84B31] resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                saving
                  ? "bg-[#D8D3C8] text-[#5D5548] cursor-not-allowed"
                  : "bg-[#C84B31] text-white hover:bg-[#A63620]"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 저장 중...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> 저장하기
                </>
              )}
            </button>

            {saveSuccess && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" /> 저장되었습니다!
              </div>
            )}

            {error && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Mock Exam Assignment */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2C241B] mb-3">
                <BookOpen className="w-4 h-4" /> 모의고사 할당
              </div>

              <select
                value={problem.mockExamId || ""}
                onChange={(e) =>
                  updateProblem({
                    mockExamId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 bg-white rounded-lg border border-[#D8D3C8] focus:outline-none focus:border-[#C84B31]"
              >
                <option value="">할당 안함</option>
                {mockExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} ({exam._count?.problems || 0}문제)
                  </option>
                ))}
              </select>

              {problem.mockExam && (
                <div className="mt-2 text-xs text-[#5D5548]">
                  현재: {problem.mockExam.title}
                </div>
              )}
            </div>

            {/* Mock Exam List */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-4">
              <div className="text-sm font-bold text-[#2C241B] mb-3">모의고사 목록</div>
              {mockExams.length === 0 ? (
                <div className="text-center text-[#5D5548] text-sm py-4">
                  등록된 모의고사가 없습니다.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-2 bg-[#EBE7DF] rounded-lg text-sm"
                    >
                      <span className="truncate">{exam.title}</span>
                      <span className="text-xs text-[#5D5548]">
                        {exam._count?.problems || 0}문제
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react"; // ★ Suspense 추가
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, RefreshCw, BookOpen, AlertCircle, CheckCircle2, XCircle, Save } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// --- Types ---
type MultiLangText = {
  jp: string;
  ko: string;
  en?: string;
};

type Sentence = {
  original: string;
  trans: {
    ko: string;
    en?: string;
  };
};

type Content = {
  layout: string;
  sentences: Sentence[];
};

type Option = {
  id: number;
  text: MultiLangText;
};

type Vocab = {
  word: string;
  reading: string;
  meaning: {
    ko: string;
    en?: string;
  };
};

type GrammarItem = {
  title: string;
  hurigana?: string;
  meaning_simple?: {
    ko: string;
    en?: string;
  };
  explanation?: {
    ko: string;
    en?: string;
  };
};

type Problem = {
  id: number;
  level: number;
  type: string;
  subType: string;
  question: MultiLangText;
  content: Content;
  options: Option[];
  answerIndex: number;
  explanation: {
    ko: string;
    en?: string;
  };
  vocab?: Vocab[];
  grammar?: GrammarItem[];
};

// --- Components ---

const LoadingState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#EBE7DF] space-y-4">
    <div className="w-12 h-12 border-4 border-[#C84B31] border-t-transparent rounded-full animate-spin"></div>
    <p className="text-[#5D5548] font-serif animate-pulse">문제를 불러오는 중입니다...</p>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#EBE7DF] space-y-6 p-4 text-center">
    <div className="w-16 h-16 bg-[#FFF5F2] rounded-full flex items-center justify-center text-[#C84B31]">
      <AlertCircle className="w-8 h-8" />
    </div>
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-[#2C241B]">문제를 불러올 수 없습니다</h2>
      <p className="text-[#5D5548]">{message}</p>
    </div>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-[#2C241B] text-white rounded-xl font-bold hover:bg-[#C84B31] transition-colors flex items-center gap-2"
    >
      <RefreshCw className="w-4 h-4" /> 다시 시도하기
    </button>
  </div>
);

// ★ 1. 기존 SolvePage 컴포넌트의 이름을 SolveContent로 변경하고 export default 제거
function SolveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { language } = useLanguage();
  const level = searchParams.get("level");
  const type = searchParams.get("type");
  const problemId = searchParams.get("problemId"); // Admin preview mode

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Interactive UI states
  const [showQuestionTrans, setShowQuestionTrans] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [activeVocab, setActiveVocab] = useState<Vocab | null>(null);
  const [activeGrammar, setActiveGrammar] = useState<GrammarItem | null>(null);

  const fetchProblem = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setShowQuestionTrans(false);
    setActiveSentenceIndex(null);
    setActiveVocab(null);
    setActiveGrammar(null);

    try {
      let url: string;
      
      if (problemId) {
        // Admin preview mode - fetch specific problem by ID
        url = `/api/problems/${problemId}`;
      } else if (level && type) {
        // Normal mode - fetch random problem by level/type
        url = `/api/practice/problem?level=${level}&type=${type}`;
      } else {
        setLoading(false);
        return;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) throw new Error("문제를 찾을 수 없습니다.");
        throw new Error("서버 오류가 발생했습니다.");
      }
      const data = await res.json();
      setProblem(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [level, type, problemId]);

  useEffect(() => {
    if (!problemId && (!level || !type)) {
      return; 
    }
    fetchProblem();
  }, [level, type, problemId, fetchProblem]);

  const handleSubmit = async () => {
    if (selectedOption === null || !problem) return;
    
    const answerOptionId = problem.options[problem.answerIndex]?.id;
    const isCorrect = selectedOption === answerOptionId;
    
    setIsSubmitted(true);
    setShowExplanation(true);
    
    // Record statistics to Firestore (async, non-blocking)
    if (session?.user) {
      try {
        await fetch("/api/stats/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: (session.user as { id?: string }).id,
            level: problem.level,
            problemType: problem.type,
            problemSubType: problem.subType,
            isCorrect,
          }),
        });
      } catch (error) {
        console.error("Failed to record stats:", error);
        // Silently fail - don't block user experience
      }
    }
  };

  // URL 파라미터가 없으면 리다이렉트 (useEffect에서 처리하지만 깜빡임 방지용)
  if (!problemId && (!level || !type)) {
      // 여기서는 null을 리턴하고 useEffect에서 이동시킴
      return null; 
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchProblem} />;
  if (!problem) return null;

  return (
    <div className="min-h-screen bg-[#EBE7DF] pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#EBE7DF]/90 backdrop-blur-md z-50 border-b border-[#D8D3C8]">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-[#D8D3C8]/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#2C241B]" />
          </button>
          <div className="font-serif font-bold text-[#2C241B]">
            N{problem.level} Practice
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-24 space-y-8">
        {/* Question Section */}
        <section className="space-y-4">
          <div 
            onClick={() => setShowQuestionTrans(!showQuestionTrans)}
            className="cursor-pointer group"
          >
            <h1 
              className="text-xl md:text-2xl font-bold text-[#2C241B] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: problem.question.jp }}
            />
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${showQuestionTrans ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}
            `}>
              <p className="text-[#C84B31] font-medium text-lg">
                {problem.question.ko}
              </p>
            </div>
            <p className="text-xs text-[#5D5548]/60 mt-2 group-hover:text-[#C84B31] transition-colors">
              * 문장을 클릭하여 번역 보기
            </p>
          </div>
        </section>

        {/* Content Section (Passage) */}
        {problem.content && (
          <section className="bg-[#FDFBF7] rounded-2xl p-6 md:p-8 shadow-sm border border-[#D8D3C8]">
            <div className="space-y-2 leading-loose text-lg text-[#2C241B] font-serif">
              {problem.content.sentences.map((sentence, idx) => (
                <span
                  key={idx}
                  onClick={() => setActiveSentenceIndex(activeSentenceIndex === idx ? null : idx)}
                  className={`
                    cursor-pointer transition-colors duration-200 relative
                    ${activeSentenceIndex === idx ? "bg-[#C84B31]/10 text-[#C84B31] rounded px-1" : "hover:bg-[#D8D3C8]/30"}
                  `}
                >
                  <span dangerouslySetInnerHTML={{ __html: sentence.original }} />
                  {activeSentenceIndex === idx && (
                    <span className="block text-base font-sans text-[#C84B31] mt-1 mb-2 font-medium">
                      {sentence.trans.ko}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Options Section */}
        <section className="space-y-3">
          {problem.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const answerOptionId = problem.options[problem.answerIndex]?.id;
            const isAnswer = answerOptionId === option.id;
            
            let stateStyle = "border-[#D8D3C8] bg-white hover:border-[#C84B31] hover:bg-[#FAFAF8]";
            if (isSubmitted) {
              if (isAnswer) stateStyle = "border-[#4CAF50] bg-[#E8F5E9] ring-1 ring-[#4CAF50]";
              else if (isSelected) stateStyle = "border-[#F44336] bg-[#FFEBEE] ring-1 ring-[#F44336]";
              else stateStyle = "border-[#D8D3C8] bg-white opacity-60";
            } else if (isSelected) {
              stateStyle = "border-[#2C241B] bg-[#2C241B] text-white";
            }

            return (
              <button
                key={option.id}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(option.id)}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-3
                  ${stateStyle}
                `}
              >
                <span className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
                  ${isSelected && !isSubmitted ? "bg-white text-[#2C241B]" : "bg-[#F5F5F0] text-[#5D5548]"}
                  ${isSubmitted && isAnswer ? "!bg-[#4CAF50] !text-white" : ""}
                  ${isSubmitted && isSelected && !isAnswer ? "!bg-[#F44336] !text-white" : ""}
                `}>
                  {option.id}
                </span>
                <div className="flex-1">
                  <p 
                    className="text-lg font-medium"
                    dangerouslySetInnerHTML={{ __html: option.text.jp }}
                  />
                  {isSubmitted && (
                    <p className={`text-sm mt-1 ${isAnswer ? "text-[#2E7D32]" : "text-[#C62828]"}`}>
                      {option.text.ko}
                    </p>
                  )}
                </div>
                {isSubmitted && isAnswer && <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />}
                {isSubmitted && isSelected && !isAnswer && <XCircle className="w-5 h-5 text-[#F44336]" />}
              </button>
            );
          })}
        </section>

        {/* Action Button */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`
              w-full py-4 rounded-xl text-lg font-bold transition-all duration-300
              ${!selectedOption 
                ? "bg-[#D8D3C8] text-[#FDFBF7] cursor-not-allowed" 
                : "bg-[#2C241B] text-white hover:bg-[#C84B31] shadow-lg hover:shadow-[#C84B31]/30"}
            `}
          >
            정답 확인하기
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={fetchProblem}
              className="flex-1 py-4 bg-[#2C241B] text-white rounded-xl font-bold hover:bg-[#C84B31] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              다음 문제 풀기
            </button>
            <button
              className="px-4 bg-white border-2 border-[#D8D3C8] text-[#5D5548] rounded-xl hover:border-[#C84B31] hover:text-[#C84B31] transition-colors"
              title="오답노트에 저장 (준비중)"
            >
              <Save className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Explanation Section */}
        {showExplanation && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#D8D3C8] shadow-sm">
              <h3 className="text-lg font-bold text-[#2C241B] mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C84B31]" />
                {language === "ko" ? "문제 해설" : "Explanation"}
              </h3>
              <div className="prose prose-stone max-w-none text-[#5D5548]">
                <p className="whitespace-pre-line">
                  {language === "ko" ? problem.explanation.ko : (problem.explanation.en || problem.explanation.ko)}
                </p>
              </div>
            </div>

            {/* Vocab & Grammar Chips */}
            {(problem.vocab || problem.grammar) && (
              <div className="flex flex-wrap gap-2">
                {problem.vocab?.map((v, idx) => (
                  <button
                    key={`vocab-${idx}`}
                    onClick={() => setActiveVocab(v)}
                    className="px-3 py-1.5 bg-[#FFF5F2] text-[#C84B31] rounded-lg text-sm font-medium hover:bg-[#C84B31] hover:text-white transition-colors border border-[#C84B31]/20"
                  >
                    {v.word}
                  </button>
                ))}
                {problem.grammar?.map((g, idx) => (
                  <button
                    key={`grammar-${idx}`}
                    onClick={() => setActiveGrammar(g)}
                    className="px-3 py-1.5 bg-[#EBF5FF] text-[#2563EB] rounded-lg text-sm font-medium hover:bg-[#2563EB] hover:text-white transition-colors border border-[#2563EB]/20"
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Vocab Modal/Popup */}
      {activeVocab && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setActiveVocab(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#2C241B]">{activeVocab.word}</h3>
                <p className="text-[#C84B31]">{activeVocab.reading}</p>
              </div>
              <button onClick={() => setActiveVocab(null)} className="text-[#D8D3C8] hover:text-[#2C241B]">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="pt-4 border-t border-[#F5F5F0]">
              <p className="text-lg text-[#5D5548] font-medium">
                {language === "ko" ? activeVocab.meaning.ko : (activeVocab.meaning.en || activeVocab.meaning.ko)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grammar Modal/Popup */}
      {activeGrammar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setActiveGrammar(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#2C241B]">{activeGrammar.title}</h3>
                {activeGrammar.hurigana && (
                  <p className="text-[#2563EB]">{activeGrammar.hurigana}</p>
                )}
              </div>
              <button onClick={() => setActiveGrammar(null)} className="text-[#D8D3C8] hover:text-[#2C241B]">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            {activeGrammar.meaning_simple && (
              <div className="pt-4 border-t border-[#F5F5F0]">
                <p className="text-lg text-[#5D5548] font-medium">
                  {language === "ko" ? activeGrammar.meaning_simple.ko : (activeGrammar.meaning_simple.en || activeGrammar.meaning_simple.ko)}
                </p>
              </div>
            )}
            {activeGrammar.explanation && (
              <div className="mt-4 pt-4 border-t border-[#F5F5F0]">
                <p className="text-sm font-bold text-[#2C241B] mb-2">상세 설명</p>
                <p className="text-[#5D5548] text-sm leading-relaxed whitespace-pre-line">{activeGrammar.explanation.ko}</p>
                {activeGrammar.explanation.en && (
                  <p className="text-xs text-[#5D5548]/60 mt-2 whitespace-pre-line">{activeGrammar.explanation.en}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ★ 2. 새로 만든 껍데기(Wrapper) 컴포넌트를 default export로 내보냄
// Suspense로 감싸서 "URL 파라미터를 읽어오는 중일 때 LoadingState를 보여줘라" 라고 설정
export default function SolvePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SolveContent />
    </Suspense>
  );
}
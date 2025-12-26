"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  AlertCircle,
  Loader2,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface Option {
  id: number;
  text: { jp: string; ko: string; en?: string };
}

interface Sentence {
  original: string;
  trans: { ko: string; en?: string };
}

interface Vocab {
  word: string;
  reading: string;
  meaning: { ko: string; en?: string };
}

interface Problem {
  id: number;
  number: number;
  type: string;
  subType: string;
  question: { jp: string; ko: string };
  content: {
    layout: string;
    sentences: Sentence[];
  };
  options: Option[];
  answerIndex: number;
  explanation: { ko: string; en?: string };
  vocab?: Vocab[];
}

interface MockExam {
  id: number;
  title: string;
  level: number;
}

export default function ExamSolvePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { language } = useLanguage();
  
  const [mockExam, setMockExam] = useState<MockExam | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Problem solving state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`/api/mockexams/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setMockExam(data.mockExam);
          setProblems(data.problems);
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

    fetchExam();
  }, [resolvedParams.id]);

  // Restore previous answer when navigating
  useEffect(() => {
    const problem = problems[currentIndex];
    if (problem) {
      setSelectedOption(answers[problem.id] || null);
      setIsSubmitted(submitted[problem.id] || false);
      setShowExplanation(submitted[problem.id] || false);
    }
  }, [currentIndex, problems, answers, submitted]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const problem = problems[currentIndex];
    
    setIsSubmitted(true);
    setShowExplanation(true);
    setAnswers(prev => ({ ...prev, [problem.id]: selectedOption }));
    setSubmitted(prev => ({ ...prev, [problem.id]: true }));
  };

  const handleNext = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowExplanation(false);
    }
  };

  const goToProblem = (index: number) => {
    setCurrentIndex(index);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBE7DF] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C84B31] animate-spin" />
      </div>
    );
  }

  if (error || !mockExam || problems.length === 0) {
    return (
      <div className="min-h-screen bg-[#EBE7DF] pt-32 flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-[#C84B31] mb-4" />
        <p className="text-[#5D5548] mb-4">{error || "문제가 없습니다."}</p>
        <Link href="/exam" className="text-[#C84B31] hover:underline">
          ← 모의고사 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const problem = problems[currentIndex];
  const isCorrect = selectedOption === problem.options[problem.answerIndex]?.id;
  const answeredCount = Object.keys(submitted).length;
  const correctCount = Object.entries(answers).filter(([problemId, optionId]) => {
    const p = problems.find(pr => pr.id === parseInt(problemId));
    return p && optionId === p.options[p.answerIndex]?.id;
  }).length;

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-24 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#D8D3C8] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/exam"
              className="w-9 h-9 bg-[#EBE7DF] rounded-full flex items-center justify-center hover:bg-[#D8D3C8] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#5D5548]" />
            </Link>
            <div>
              <span className="text-xs text-[#5D5548] block">N{mockExam.level}</span>
              <span className="font-bold text-[#2C241B]">{mockExam.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-[#C84B31] font-bold">{answeredCount}</span>
              <span className="text-[#5D5548]">/{problems.length} {language === "ko" ? "완료" : "done"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {/* Problem Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-[#C84B31]">問{problem.number}</span>
            <span className="px-2 py-0.5 bg-[#EBE7DF] rounded text-xs text-[#5D5548]">
              {problem.type} / {problem.subType}
            </span>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl p-6 border border-[#D8D3C8] mb-6">
            <p className="text-lg text-[#2C241B] font-medium" dangerouslySetInnerHTML={{ __html: problem.question.jp }} />
          </div>

          {/* Content/Passage */}
          {problem.content.sentences.length > 0 && problem.content.sentences[0].original && (
            <div className="bg-[#FDFBF7] rounded-2xl p-6 border border-[#D8D3C8] mb-6">
              <div className="space-y-2 leading-loose text-lg text-[#2C241B] font-serif">
                {problem.content.sentences.map((sentence, idx) => (
                  <span key={idx} dangerouslySetInnerHTML={{ __html: sentence.original }} />
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3 mb-6">
            {problem.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isAnswer = problem.answerIndex === option.id - 1;
              
              let stateStyle = "border-[#D8D3C8] bg-white hover:border-[#C84B31]";
              if (isSubmitted) {
                if (isAnswer) stateStyle = "border-green-500 bg-green-50 ring-1 ring-green-500";
                else if (isSelected) stateStyle = "border-red-500 bg-red-50 ring-1 ring-red-500";
                else stateStyle = "border-[#D8D3C8] bg-white opacity-60";
              } else if (isSelected) {
                stateStyle = "border-[#2C241B] bg-[#2C241B] text-white";
              }

              return (
                <button
                  key={option.id}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${stateStyle}`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isSelected && !isSubmitted ? "bg-white text-[#2C241B]" : "bg-[#EBE7DF] text-[#5D5548]"
                  } ${isSubmitted && isAnswer ? "!bg-green-500 !text-white" : ""}
                  ${isSubmitted && isSelected && !isAnswer ? "!bg-red-500 !text-white" : ""}`}>
                    {option.id}
                  </span>
                  <span className="text-lg" dangerouslySetInnerHTML={{ __html: option.text.jp }} />
                  {isSubmitted && isAnswer && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
                  {isSubmitted && isSelected && !isAnswer && <XCircle className="w-5 h-5 text-red-600 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Submit / Navigation */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                selectedOption !== null
                  ? "bg-[#C84B31] text-white hover:bg-[#A63620]"
                  : "bg-[#D8D3C8] text-[#5D5548] cursor-not-allowed"
              }`}
            >
              <Check className="w-5 h-5" />
              {language === "ko" ? "정답 확인" : "Check Answer"}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                  currentIndex === 0
                    ? "bg-[#D8D3C8] text-[#5D5548] cursor-not-allowed"
                    : "bg-[#2C241B] text-white hover:bg-[#5D5548]"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                {language === "ko" ? "이전" : "Prev"}
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === problems.length - 1}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                  currentIndex === problems.length - 1
                    ? "bg-[#D8D3C8] text-[#5D5548] cursor-not-allowed"
                    : "bg-[#C84B31] text-white hover:bg-[#A63620]"
                }`}
              >
                {language === "ko" ? "다음" : "Next"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 bg-white rounded-2xl p-6 border border-[#D8D3C8]">
              <h3 className="text-lg font-bold text-[#2C241B] mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C84B31]" />
                {language === "ko" ? "해설" : "Explanation"}
              </h3>
              <p className="text-[#5D5548] whitespace-pre-line">
                {language === "ko" ? problem.explanation.ko : (problem.explanation.en || problem.explanation.ko)}
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Problem Navigation */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32 bg-white rounded-2xl border border-[#D8D3C8] p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2C241B]">{language === "ko" ? "문제 목록" : "Problems"}</h3>
              <div className="text-xs text-[#5D5548]">
                <span className="text-green-600 font-bold">{correctCount}</span>
                <span className="mx-1">/</span>
                <span className="text-red-600 font-bold">{answeredCount - correctCount}</span>
                <span className="mx-1">/</span>
                <span>{problems.length - answeredCount}</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex gap-3 mb-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-[#5D5548]">{language === "ko" ? "정답" : "Correct"}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-[#5D5548]">{language === "ko" ? "오답" : "Wrong"}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#D8D3C8]"></div>
                <span className="text-[#5D5548]">{language === "ko" ? "미풀이" : "Unsolved"}</span>
              </div>
            </div>
            
            {/* Problem Grid */}
            <div className="grid grid-cols-5 gap-2">
              {problems.map((p, idx) => {
                const isAnswered = submitted[p.id];
                const wasCorrect = isAnswered && answers[p.id] === p.options[p.answerIndex]?.id;
                const isCurrent = idx === currentIndex;
                
                let bgClass = "bg-[#EBE7DF] text-[#5D5548] hover:bg-[#D8D3C8]";
                if (isCurrent) {
                  bgClass = "bg-[#C84B31] text-white ring-2 ring-[#C84B31] ring-offset-2";
                } else if (isAnswered) {
                  bgClass = wasCorrect 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white";
                }
                
                return (
                  <button
                    key={p.id}
                    onClick={() => goToProblem(idx)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${bgClass}`}
                  >
                    {p.number}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#D8D3C8] p-3 z-50">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {problems.map((p, idx) => {
            const isAnswered = submitted[p.id];
            const wasCorrect = isAnswered && answers[p.id] === p.options[p.answerIndex]?.id;
            const isCurrent = idx === currentIndex;
            
            let bgClass = "bg-[#EBE7DF] text-[#5D5548]";
            if (isCurrent) {
              bgClass = "bg-[#C84B31] text-white scale-110";
            } else if (isAnswered) {
              bgClass = wasCorrect 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : "bg-red-100 text-red-700 border border-red-300";
            }
            
            return (
              <button
                key={p.id}
                onClick={() => goToProblem(idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${bgClass}`}
              >
                {p.number}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


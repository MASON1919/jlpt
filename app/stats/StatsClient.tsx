"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Target,
  BookOpen,
  Languages,
  Glasses,
  Ear,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useLanguage } from "@/lib/i18n";

// Types
interface StatCount {
  correct: number;
  total: number;
}

interface LevelStats {
  problemType: Record<string, StatCount>;
  problemSubType: Record<string, StatCount>;
}

interface UserStats {
  [level: string]: LevelStats;
}

interface StatsClientProps {
  userName: string;
  targetLevel: number;
  stats: UserStats;
}

// Constants
const LEVELS = [
  { id: "1", label: "N1" },
  { id: "2", label: "N2" },
  { id: "3", label: "N3" },
  { id: "4", label: "N4" },
  { id: "5", label: "N5" },
];

const PROBLEM_TYPE_LABELS: Record<string, { ko: string; en: string; icon: React.ReactNode }> = {
  VOCAB: { ko: "어휘", en: "Vocabulary", icon: <Languages className="w-4 h-4" /> },
  GRAMMAR: { ko: "문법", en: "Grammar", icon: <BookOpen className="w-4 h-4" /> },
  READING: { ko: "독해", en: "Reading", icon: <Glasses className="w-4 h-4" /> },
  LISTENING: { ko: "청해", en: "Listening", icon: <Ear className="w-4 h-4" /> },
};

const SUBTYPE_LABELS: Record<string, { ko: string; en: string }> = {
  KANJI_READING: { ko: "한자 읽기", en: "Kanji Reading" },
  ORTHOGRAPHY: { ko: "표기", en: "Orthography" },
  WORD_FORMATION: { ko: "어형성", en: "Word Formation" },
  CONTEXT: { ko: "문맥", en: "Context" },
  PARAPHRASE: { ko: "유의표현", en: "Paraphrase" },
  USAGE: { ko: "용법", en: "Usage" },
  GRAMMAR_FORM: { ko: "문법형식", en: "Grammar Form" },
  GRAMMAR_ORDER: { ko: "문장배열", en: "Grammar Order" },
  TEXT_GRAMMAR: { ko: "문장문법", en: "Text Grammar" },
  SHORT_PASSAGE: { ko: "단문", en: "Short Passage" },
  MID_PASSAGE: { ko: "중문", en: "Mid Passage" },
  LONG_PASSAGE: { ko: "장문", en: "Long Passage" },
  INTEGRATED_PASSAGE: { ko: "통합이해", en: "Integrated Passage" },
  THEMATIC_PASSAGE: { ko: "주제이해", en: "Thematic Passage" },
  INFO_RETRIEVAL: { ko: "정보검색", en: "Info Retrieval" },
  TASK_BASED: { ko: "과제이해", en: "Task-Based" },
  POINT_COMPREHENSION: { ko: "포인트이해", en: "Point Comprehension" },
  SUMMARY: { ko: "요약", en: "Summary" },
  QUICK_RESPONSE: { ko: "즉시응답", en: "Quick Response" },
  INTEGRATED_COMPREHENSION: { ko: "통합이해", en: "Integrated Comprehension" },
};

const COLORS = ["#C84B31", "#2C241B", "#4CAF50", "#2196F3", "#FF9800", "#9C27B0"];

export default function StatsClient({ userName, targetLevel, stats }: StatsClientProps) {
  const [selectedLevel, setSelectedLevel] = useState(String(targetLevel));
  const { language } = useLanguage();
  const t = language === "ko" ? TRANSLATIONS.ko : TRANSLATIONS.en;

  const currentStats = stats[selectedLevel];

  // Prepare data for charts
  const typeChartData = currentStats
    ? Object.entries(currentStats.problemType)
        .filter(([, stat]) => stat.total > 0)
        .map(([type, stat]) => ({
          name: PROBLEM_TYPE_LABELS[type]?.[language] || type,
          정답률: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
          정답: stat.correct,
          전체: stat.total,
        }))
    : [];

  const subTypeChartData = currentStats
    ? Object.entries(currentStats.problemSubType || {})
        .filter(([, stat]) => stat.total > 0)
        .map(([subType, stat]) => ({
          name: SUBTYPE_LABELS[subType]?.[language] || subType,
          정답률: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
          정답: stat.correct,
          전체: stat.total,
        }))
        .sort((a, b) => b.전체 - a.전체)
        .slice(0, 10)
    : [];

  // Calculate overall stats
  const overallStats = currentStats
    ? Object.values(currentStats.problemType).reduce(
        (acc, stat) => ({
          correct: acc.correct + stat.correct,
          total: acc.total + stat.total,
        }),
        { correct: 0, total: 0 }
      )
    : { correct: 0, total: 0 };

  const overallAccuracy =
    overallStats.total > 0
      ? Math.round((overallStats.correct / overallStats.total) * 100)
      : 0;

  // Pie chart data for type distribution
  const pieChartData = currentStats
    ? Object.entries(currentStats.problemType)
        .filter(([, stat]) => stat.total > 0)
        .map(([type, stat]) => ({
          name: PROBLEM_TYPE_LABELS[type]?.[language] || type,
          value: stat.total,
        }))
    : [];

  const hasData = overallStats.total > 0;

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 hover:bg-[#D8D3C8]/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#2C241B]" />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#2C241B]">
              {t.title}
            </h1>
            <p className="text-[#5D5548] mt-1">
              {userName}{t.greeting}
            </p>
          </div>
        </div>

        {/* Level Selector */}
        <div className="bg-[#FDFBF7] p-1.5 rounded-xl border border-[#D8D3C8] inline-flex shadow-sm mb-8">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`
                px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                ${
                  selectedLevel === level.id
                    ? "bg-[#2C241B] text-white shadow-md"
                    : "text-[#5D5548] hover:bg-[#EBE7DF] hover:text-[#2C241B]"
                }
              `}
            >
              {level.label}
            </button>
          ))}
        </div>

        {!hasData ? (
          /* Empty State */
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#D8D3C8] p-12 text-center">
            <div className="w-20 h-20 bg-[#EBE7DF] rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-[#5D5548]" />
            </div>
            <h2 className="text-2xl font-serif text-[#2C241B] mb-2">
              {t.noDataTitle}
            </h2>
            <p className="text-[#5D5548] mb-6">{t.noDataDesc}</p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 bg-[#2C241B] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#C84B31] transition-colors"
            >
              {t.startPractice}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Problems */}
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#2C241B] rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#5D5548]">
                    {t.totalProblems}
                  </span>
                </div>
                <p className="text-4xl font-bold font-serif text-[#2C241B]">
                  {overallStats.total}
                </p>
              </div>

              {/* Correct Answers */}
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#4CAF50] rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#5D5548]">
                    {t.correctAnswers}
                  </span>
                </div>
                <p className="text-4xl font-bold font-serif text-[#4CAF50]">
                  {overallStats.correct}
                </p>
              </div>

              {/* Accuracy Rate */}
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#C84B31] rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#5D5548]">
                    {t.accuracyRate}
                  </span>
                </div>
                <p className="text-4xl font-bold font-serif text-[#C84B31]">
                  {overallAccuracy}%
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart - Accuracy by Type */}
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
                <h3 className="text-lg font-bold text-[#2C241B] mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#C84B31]" />
                  {t.accuracyByType}
                </h3>
                {typeChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={typeChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#D8D3C8" />
                      <XAxis dataKey="name" tick={{ fill: "#5D5548", fontSize: 12 }} />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#5D5548", fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FDFBF7",
                          border: "1px solid #D8D3C8",
                          borderRadius: "12px",
                        }}
                        formatter={(value, name) => [
                          `${value ?? 0}%`,
                          name === "정답률" ? t.accuracy : name,
                        ]}
                      />
                      <Bar dataKey="정답률" fill="#C84B31" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-[#5D5548]">
                    {t.noTypeData}
                  </div>
                )}
              </div>

              {/* Pie Chart - Problem Distribution */}
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
                <h3 className="text-lg font-bold text-[#2C241B] mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#C84B31]" />
                  {t.problemDistribution}
                </h3>
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FDFBF7",
                          border: "1px solid #D8D3C8",
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-[#5D5548]">
                    {t.noDistributionData}
                  </div>
                )}
              </div>
            </div>

            {/* Subtype Details */}
            {subTypeChartData.length > 0 && (
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] p-6">
                <h3 className="text-lg font-bold text-[#2C241B] mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#C84B31]" />
                  {t.detailedStats}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={subTypeChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#D8D3C8" />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: "#5D5548", fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#5D5548", fontSize: 11 }}
                      width={100}
                    />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FDFBF7",
                          border: "1px solid #D8D3C8",
                          borderRadius: "12px",
                        }}
                        formatter={(value, name) => [
                          `${value ?? 0}%`,
                          name === "정답률" ? t.accuracy : name,
                        ]}
                      />
                    <Legend />
                    <Bar dataKey="정답률" fill="#2C241B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Type Detail Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(currentStats?.problemType || {}).map(([type, stat]) => {
                const accuracy =
                  stat.total > 0
                    ? Math.round((stat.correct / stat.total) * 100)
                    : 0;
                const typeInfo = PROBLEM_TYPE_LABELS[type];
                return (
                  <div
                    key={type}
                    className="bg-[#FDFBF7] rounded-xl border border-[#D8D3C8] p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-[#EBE7DF] rounded-lg flex items-center justify-center text-[#5D5548]">
                        {typeInfo?.icon}
                      </div>
                      <span className="text-sm font-medium text-[#5D5548]">
                        {typeInfo?.[language] || type}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-[#2C241B]">
                          {accuracy}%
                        </p>
                        <p className="text-xs text-[#5D5548]">
                          {stat.correct}/{stat.total}
                        </p>
                      </div>
                      {/* Mini progress bar */}
                      <div className="w-16 h-2 bg-[#EBE7DF] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C84B31] rounded-full transition-all"
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Translations
const TRANSLATIONS = {
  ko: {
    title: "나의 학습 통계",
    greeting: "님의 학습 현황입니다",
    noDataTitle: "아직 풀이 기록이 없습니다",
    noDataDesc: "문제를 풀면 여기에 통계가 표시됩니다",
    startPractice: "문제 풀기 시작",
    totalProblems: "총 풀이 문제",
    correctAnswers: "정답 수",
    accuracyRate: "정답률",
    accuracyByType: "유형별 정답률",
    problemDistribution: "문제 유형 분포",
    detailedStats: "세부 유형별 통계 (상위 10개)",
    accuracy: "정답률",
    noTypeData: "유형별 데이터가 없습니다",
    noDistributionData: "분포 데이터가 없습니다",
  },
  en: {
    title: "My Learning Statistics",
    greeting: "'s learning progress",
    noDataTitle: "No records yet",
    noDataDesc: "Statistics will appear here after solving problems",
    startPractice: "Start Practice",
    totalProblems: "Total Problems",
    correctAnswers: "Correct Answers",
    accuracyRate: "Accuracy Rate",
    accuracyByType: "Accuracy by Type",
    problemDistribution: "Problem Distribution",
    detailedStats: "Detailed Stats (Top 10)",
    accuracy: "Accuracy",
    noTypeData: "No type data available",
    noDistributionData: "No distribution data available",
  },
};

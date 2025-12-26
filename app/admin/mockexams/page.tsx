"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  BookMarked,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface MockExam {
  id: number;
  title: string;
  level: number;
  createdAt: string;
  _count: { problems: number };
}

export default function MockExamListPage() {
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLevel, setNewLevel] = useState(1);
  const [creating, setCreating] = useState(false);

  const fetchMockExams = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mockexams");
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

  useEffect(() => {
    fetchMockExams();
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/admin/mockexams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, level: newLevel }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewLevel(1);
        setShowCreateModal(false);
        fetchMockExams();
      }
    } catch (error) {
      console.error("Failed to create mock exam:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#D8D3C8] hover:border-[#C84B31] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#5D5548]" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#2C241B]">
                모의고사 관리
              </h1>
              <p className="text-[#5D5548] text-sm">모의고사를 생성하고 문제를 할당하세요.</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C84B31] text-white rounded-xl font-bold hover:bg-[#A63620] transition-colors"
          >
            <Plus className="w-5 h-5" /> 새 모의고사
          </button>
        </div>

        {/* Mock Exam List */}
        <div className="bg-[#FDFBF7] rounded-2xl border border-[#D8D3C8] overflow-hidden">
          <div className="bg-[#2C241B] text-white px-6 py-3 flex justify-between items-center">
            <span className="font-medium">모의고사 목록</span>
            <span className="text-sm text-white/70">총 {mockExams.length}개</span>
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#C84B31] animate-spin" />
            </div>
          ) : mockExams.length === 0 ? (
            <div className="py-20 text-center text-[#5D5548]">
              <BookMarked className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>등록된 모의고사가 없습니다.</p>
              <p className="text-sm mt-1">새 모의고사를 생성해주세요.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D8D3C8]">
              {mockExams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/admin/mockexams/${exam.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EBE7DF]/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-[#C84B31] text-white rounded text-xs font-bold">
                        N{exam.level}
                      </span>
                      <span className="text-xs text-[#5D5548]">
                        #{exam.id}
                      </span>
                    </div>
                    <p className="text-[#2C241B] font-medium truncate">
                      {exam.title}
                    </p>
                    <p className="text-xs text-[#5D5548] mt-1">
                      {exam._count.problems}개 문제
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#D8D3C8] flex-shrink-0 ml-4" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-[#2C241B] mb-6">새 모의고사 생성</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#2C241B] block mb-1">제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 2024년 제1회 JLPT N1 모의고사"
                  className="w-full px-4 py-3 rounded-xl border border-[#D8D3C8] focus:outline-none focus:border-[#C84B31]"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#2C241B] block mb-1">급수</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setNewLevel(level)}
                      className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                        newLevel === level
                          ? "bg-[#C84B31] text-white"
                          : "bg-[#EBE7DF] text-[#5D5548] hover:bg-[#D8D3C8]"
                      }`}
                    >
                      N{level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#D8D3C8] text-[#5D5548] font-medium hover:bg-[#EBE7DF] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim() || creating}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                  newTitle.trim() && !creating
                    ? "bg-[#C84B31] text-white hover:bg-[#A63620]"
                    : "bg-[#D8D3C8] text-[#5D5548] cursor-not-allowed"
                }`}
              >
                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

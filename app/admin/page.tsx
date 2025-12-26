import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { Shield, FileText, Plus, BookMarked } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#EBE7DF] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 bg-[#2C241B] rounded-2xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#2C241B]">
              Admin Dashboard
            </h1>
            <p className="text-[#5D5548]">관리자 전용 페이지</p>
          </div>
        </div>

        {/* Admin Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Problem Card */}
          <Link 
            href="/admin/problems/new"
            className="group bg-[#FDFBF7] rounded-3xl p-8 border border-[#D8D3C8] hover:border-[#C84B31] hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-[#C84B31] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#2C241B] mb-2 group-hover:text-[#C84B31] transition-colors">
              문제 추가
            </h2>
            <p className="text-[#5D5548] text-sm">
              JSON 입력으로 새로운 문제를 DB에 저장합니다.
            </p>
          </Link>

          {/* Problem List Card */}
          <Link 
            href="/admin/problems"
            className="group bg-[#FDFBF7] rounded-3xl p-8 border border-[#D8D3C8] hover:border-[#C84B31] hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-[#2C241B] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#2C241B] mb-2 group-hover:text-[#C84B31] transition-colors">
              문제 목록
            </h2>
            <p className="text-[#5D5548] text-sm">
              등록된 문제를 조회하고 편집합니다.
            </p>
          </Link>

          {/* Mock Exam Management Card */}
          <Link 
            href="/admin/mockexams"
            className="group bg-[#FDFBF7] rounded-3xl p-8 border border-[#D8D3C8] hover:border-[#C84B31] hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-[#5D5548] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookMarked className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#2C241B] mb-2 group-hover:text-[#C84B31] transition-colors">
              모의고사 관리
            </h2>
            <p className="text-[#5D5548] text-sm">
              모의고사를 생성하고 문제를 할당합니다.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { User, CreditCard, Settings, Calendar, Shield, Zap, ExternalLink, LogOut } from "lucide-react";
import MyPageSubscribeButton from "./MyPageSubscribeButton";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

export const metadata = {
  title: "마이 페이지 - JLPT NEXT",
  description: "내 프로필과 구독 정보를 관리하세요.",
};

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      isPro: true,
      subscriptionStatus: true,
      currentPeriodEnd: true,
      customerPortalUrl: true,
      subscriptionProvider: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const isPro = user.isPro;
  const isExpired = isPro && user.currentPeriodEnd ? new Date(user.currentPeriodEnd) < new Date() : false;
  
  // Format dates consistently
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">마이 페이지</h1>
            <p className="mt-2 text-sm text-gray-500">
              계정 설정 및 멤버십 구독 정보를 관리하세요.
            </p>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            나가기
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-4">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      fill
                      className="rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                  )}
                  {isPro && !isExpired && (
                    <div className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-full shadow-sm border-2 border-white" title="PRO 멤버십">
                      <Zap className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || "이름 없음"}</h2>
                <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                
                <div className="w-full pt-6 border-t border-gray-100">
                   <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">계정 상태</p>
                   {isPro && !isExpired ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                        <Shield className="w-4 h-4" />
                        PRO 멤버십
                      </div>
                   ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium border border-gray-200">
                        <User className="w-4 h-4" />
                         무료 플랜
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Subscription & Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Subscription Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">구독 멤버십</h3>
                  </div>
                  {isPro && !isExpired && (
                     <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        이용 중
                     </span>
                  )}
                </div>
                
                <div className="p-6">
                   {isPro ? (
                      <div className="space-y-6">
                        {isExpired ? (
                             <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                   <CreditCard className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                   <h4 className="font-semibold text-red-900">멤버십이 만료되었습니다</h4>
                                   <p className="text-sm text-red-700 mt-1">PRO 기능을 다시 이용하시려면 구독을 갱신해주세요.</p>
                                   <MyPageSubscribeButton className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-red-700 hover:text-red-800 hover:underline">
                                      지금 다시 구독하기 <ExternalLink className="w-3 h-3" />
                                   </MyPageSubscribeButton>
                                </div>
                             </div>
                        ) : (
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-5 border border-blue-100/50">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-blue-900">현재 이용중인 플랜</p>
                                    <h4 className="text-2xl font-bold text-blue-700">JLPT NEXT PRO</h4>
                                    <div className="flex items-center gap-2 text-sm text-blue-600/80 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>다음 결제일: {formatDate(user.currentPeriodEnd)}</span>
                                    </div>
                                </div>
                             </div>
                        )}

                        {!isExpired && (
                            <div className="flex flex-col gap-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">결제 및 구독 설정</span>
                                    {user.customerPortalUrl ? (
                                        <a 
                                            href={user.customerPortalUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                                        >
                                            <Settings className="w-4 h-4" />
                                            구독 관리
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400">관리 페이지 정보 없음</span>
                                    )}
                                </div>
                                
                                {user.subscriptionStatus !== "cancelled" && (
                                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="text-sm text-gray-500">구독을 그만두시겠어요?</span>
                                    <CancelSubscriptionButton />
                                  </div>
                                )}
                            </div>
                        )}
                      </div>
                   ) : (
                      <div className="text-center py-8">
                         <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4">
                            <Zap className="w-6 h-6" />
                         </div>
                         <h3 className="text-lg font-bold text-gray-900 mb-2">PRO로 업그레이드하세요</h3>
                         <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                            언어 학습의 한계를 넘어서세요. 모든 문제 열람, 고급 통계 분석, 무제한 학습 기능을 제공합니다.
                         </p>
                         <MyPageSubscribeButton 
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                         >
                            지금 구독 시작하기
                            <ExternalLink className="w-4 h-4" />
                         </MyPageSubscribeButton>
                      </div>
                   )}
                </div>
            </div>

            {/* Additional Info / Placeholder for future sections */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <h3 className="font-semibold text-gray-900 mb-4">로그인 보안</h3>
               <div className="flex items-center justify-between py-2">
                  <div>
                      <p className="text-sm font-medium text-gray-700">소셜 로그인</p>
                      <p className="text-xs text-gray-500 mt-0.5">Google 계정으로 로그인 중입니다.</p>
                  </div>
                  {/* Logout Logic usually handled by NextAuth signOut(), often in navbar, but can be added here if needed */}
                  <div className="bg-gray-100 px-3 py-1.5 rounded-lg">
                      <span className="text-xs font-semibold text-gray-600">Google</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

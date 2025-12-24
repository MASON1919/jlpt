"use client";

import { useLanguage } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { User, CreditCard, Settings, Calendar, Shield, Zap, ExternalLink, LogOut } from "lucide-react";
import MyPageSubscribeButton from "./MyPageSubscribeButton";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

interface MyPageClientProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    isPro: boolean;
  };
  subscription: {
    status: string;
    currentPeriodEnd: Date | null;
    customerPortalUrl: string | null;
    provider: string;
    cancelledAt: Date | null;
  } | null;
  isExpired: boolean;
}

export default function MyPageClient({ user, subscription, isExpired }: MyPageClientProps) {
  const { t, language } = useLanguage();
  const isPro = user.isPro;

  // Format dates consistently
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const isCancelled = subscription?.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t.mypage.title}</h1>
            <p className="mt-2 text-sm text-gray-500">
              {t.mypage.subtitle}
            </p>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            {t.common.exit}
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
                    <div className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-full shadow-sm border-2 border-white" title={t.mypage.proMembership}>
                      <Zap className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || t.mypage.noName}</h2>
                <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                
                <div className="w-full pt-6 border-t border-gray-100">
                   <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">{t.mypage.accountStatus}</p>
                   {isPro && !isExpired ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                        <Shield className="w-4 h-4" />
                        {t.mypage.proMembership}
                      </div>
                   ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium border border-gray-200">
                        <User className="w-4 h-4" />
                         {t.mypage.freePlan}
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
                    <h3 className="font-semibold text-gray-900">{t.mypage.subscriptionMembership}</h3>
                  </div>
                  {isPro && !isExpired && !isCancelled && (
                     <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        {t.mypage.active}
                     </span>
                  )}
                  {isCancelled && !isExpired && (
                     <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                        {language === "ko" ? "해지 예정" : "Cancelling"}
                     </span>
                  )}
                </div>
                
                <div className="p-6">
                   {subscription && isPro ? (
                      <div className="space-y-6">
                        {isExpired ? (
                             <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                   <CreditCard className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                   <h4 className="font-semibold text-red-900">{t.mypage.expired}</h4>
                                   <p className="text-sm text-red-700 mt-1">{t.mypage.expiredDesc}</p>
                                   <MyPageSubscribeButton className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-red-700 hover:text-red-800 hover:underline">
                                      {t.mypage.resubscribe} <ExternalLink className="w-3 h-3" />
                                   </MyPageSubscribeButton>
                                </div>
                             </div>
                        ) : (
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-5 border border-blue-100/50">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-blue-900">{t.mypage.currentPlan}</p>
                                    <h4 className="text-2xl font-bold text-blue-700">JLPT NEXT PRO</h4>
                                    <div className="flex items-center gap-2 text-sm text-blue-600/80 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                          {isCancelled 
                                            ? (language === "ko" ? "만료 예정일: " : "Expires: ")
                                            : t.mypage.nextPayment
                                          }
                                          {formatDate(subscription.currentPeriodEnd)}
                                        </span>
                                    </div>
                                </div>
                             </div>
                        )}

                        {!isExpired && (
                            <div className="flex flex-col gap-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{t.mypage.paymentSettings}</span>
                                    {subscription.customerPortalUrl ? (
                                        <a 
                                            href={subscription.customerPortalUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                                        >
                                            <Settings className="w-4 h-4" />
                                            {t.mypage.manageSubscription}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400">{t.mypage.noPortal}</span>
                                    )}
                                </div>
                                
                                {!isCancelled && (
                                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="text-sm text-gray-500">{t.mypage.cancelQuestion}</span>
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
                         <h3 className="text-lg font-bold text-gray-900 mb-2">{t.mypage.upgradeToPro}</h3>
                         <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                            {t.mypage.upgradeDesc}
                         </p>
                         <MyPageSubscribeButton 
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                         >
                            {t.mypage.startSubscription}
                            <ExternalLink className="w-4 h-4" />
                         </MyPageSubscribeButton>
                      </div>
                   )}
                </div>
            </div>

            {/* Additional Info / Placeholder for future sections */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <h3 className="font-semibold text-gray-900 mb-4">{t.mypage.loginSecurity}</h3>
               <div className="flex items-center justify-between py-2">
                  <div>
                      <p className="text-sm font-medium text-gray-700">{t.mypage.socialLogin}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.mypage.googleLogin}</p>
                  </div>
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

"use client";

import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // google provider ID로 로그인 요청
    // callbackUrl은 로그인 성공 후 이동할 페이지 (보통 메인이나 대시보드)
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen w-full bg-[#EBE7DF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 요소 (은은한 한자나 그래픽) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C84B31] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 text-[#2C241B] opacity-[0.05] text-9xl font-serif select-none pointer-events-none">
        合格
      </div>

      {/* 메인 카드 */}
      <div className="bg-[#FDFBF7] w-full max-w-md rounded-3xl shadow-xl border border-[#D8D3C8] p-8 md:p-12 relative z-10 flex flex-col items-center text-center">
        {/* 뒤로가기 링크 */}
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="text-[#5D5548] hover:text-[#C84B31] transition-colors p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* 로고 영역 */}
        <div className="mb-8 mt-4">
          <div className="w-16 h-16 bg-[#2C241B] rounded-2xl flex items-center justify-center text-[#FDFBF7] font-serif text-2xl font-bold mb-4 mx-auto shadow-lg">
            J
          </div>
          <h1 className="text-2xl font-serif text-[#2C241B] tracking-tight">
            JLPT.<span className="text-[#C84B31]">M</span>aster
          </h1>
        </div>

        {/* 환영 문구 & 명언 */}
        <div className="space-y-2 mb-10">
          <h2 className="text-xl font-bold text-[#2C241B]">
            학습을 시작할 준비가 되셨나요?
          </h2>
          <p className="text-[#5D5548] text-sm font-medium font-serif italic">
            "천리길도 한 걸음부터"
          </p>
          <p className="text-[#5D5548]/60 text-xs">千里の道も一歩から</p>
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-[#D8D3C8] text-[#2C241B] px-6 py-4 rounded-xl hover:bg-[#F5F5F0] hover:border-[#C84B31]/30 hover:shadow-md transition-all duration-200 group"
        >
          {/* Google G Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium group-hover:text-[#C84B31] transition-colors">
            Google 계정으로 계속하기
          </span>
        </button>

        {/* 하단 링크 */}
        <div className="mt-8 text-xs text-[#5D5548]/60">
          로그인 시
          <Link href="#" className="underline hover:text-[#C84B31] mx-1">
            이용약관
          </Link>
          및
          <Link href="#" className="underline hover:text-[#C84B31] mx-1">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </div>
      </div>
    </div>
  );
}

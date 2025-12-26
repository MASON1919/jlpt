"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { User, PenTool, BarChart3, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname?.startsWith("/practice/solve")) return null;
  else if (pathname?.startsWith("/payment")) return null;
  else if(pathname?.startsWith("/mypage")) return null;
  else if(pathname?.startsWith("/stats")) return null;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
      <div className="bg-[#FDFBF7]/95 backdrop-blur-md rounded-full px-6 py-4 shadow-lg border border-[#D8D3C8] flex justify-between items-center transition-all duration-300">
        {/* 1. 로고 */}
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tighter text-[#2C241B] flex-shrink-0 mr-4"
        >
          Ahiroo
        </Link>

        {/* 2. 메인 네비게이션 (중앙) */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-[#5D5548]">
          <Link
            href="/exam"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-[#EBE7DF] hover:text-[#C84B31] transition-all"
          >
            <PenTool className="w-4 h-4" />
            <span>{t.navbar.mockExam}</span>
          </Link>

          {/* 구분선 */}
          <div className="w-[1px] h-4 bg-[#D8D3C8] mx-2" />

          <Link
            href="/#features"
            className="px-3 py-2 hover:text-[#C84B31] transition-colors"
          >
            {t.navbar.features}
          </Link>
          <Link
            href="/#pricing"
            className="px-3 py-2 hover:text-[#C84B31] transition-colors"
          >
            {t.navbar.pricing}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-20 h-8 animate-pulse bg-gray-200 rounded-full" />
          ) : session ? (
            <div className="flex items-center gap-3 pl-2">
              <div className="flex items-center gap-2">
                {session.user?.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D8D3C8]">
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-[#2C241B] rounded-full flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="text-sm font-bold text-[#2C241B] hidden sm:block truncate max-w-[100px]">
                  {session.user?.name}
                </span>
                <Link 
                  href="/stats" 
                  className="bg-[#C84B31]/10 p-1.5 rounded-full hover:bg-[#C84B31]/20 transition-colors"
                  title={t.navbar.stats || "Statistics"}
                >
                  <BarChart3 className="w-4 h-4 text-[#C84B31]" />
                </Link>
                {session.user?.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="bg-[#2C241B] p-1.5 rounded-full hover:bg-[#C84B31] transition-colors"
                    title="Admin"
                  >
                    <Shield className="w-4 h-4 text-white" />
                  </Link>
                )}
                <Link 
                  href="/mypage" 
                  className="bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                  title={t.navbar.myPage}
                >
                  <User className="w-4 h-4 text-gray-600" />
                </Link>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs font-medium text-[#5D5548] hover:text-[#C84B31] transition-colors border-l border-[#D8D3C8] pl-3 ml-1"
              >
                {t.common.logout}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#2C241B] text-[#FDFBF7] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#C84B31] transition-colors whitespace-nowrap"
            >
              {t.common.getStarted}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}


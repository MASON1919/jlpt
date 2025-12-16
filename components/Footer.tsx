import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-[#2C241B] text-[#EBE7DF]/60 py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl text-[#EBE7DF] mb-8">JLPT MASTER</h2>
        <div className="flex justify-center gap-8 mb-12 text-sm font-medium">
          <Link href="#" className="hover:text-white">
            서비스 소개
          </Link>
          <Link href="#features" className="hover:text-white">
            주요 기능
          </Link>
          <Link href="#pricing" className="hover:text-white">
            요금제
          </Link>
          <Link href="#" className="hover:text-white">
            문의하기
          </Link>
        </div>
        <p className="text-xs">
          © 2025 JLPT Master Inc. All rights reserved.{" "}
          <br className="sm:hidden" /> Designed for calm learning.
        </p>
      </div>
    </footer>
  );
}

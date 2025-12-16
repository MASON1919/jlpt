"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function FailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">결제 실패 😭</h1>

        <div className="mb-6 text-left bg-white p-4 rounded border">
          <p className="text-sm text-gray-500 mb-1">에러 코드</p>
          <p className="font-mono font-bold mb-3">{searchParams.get("code")}</p>

          <p className="text-sm text-gray-500 mb-1">실패 사유</p>
          <p className="font-medium">{searchParams.get("message")}</p>
        </div>

        <button
          onClick={() => router.push("/payment")}
          className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          다시 결제하기
        </button>
      </div>
    </div>
  );
}

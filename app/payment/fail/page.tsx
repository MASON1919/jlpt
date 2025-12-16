// app/payment/fail/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function FailPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">결제 취소 / 실패 😭</h1>

        <div className="mb-6 text-gray-600 bg-white p-4 rounded border">
          <p>결제가 완료되지 않았습니다.</p>
          <p className="text-sm mt-2">
            결제 과정에서 문제가 발생했거나,<br/>
            사용자가 결제를 취소했습니다.
          </p>
        </div>

        <button
          onClick={() => router.push("/pricing")} // 다시 가격표 페이지로 이동
          className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
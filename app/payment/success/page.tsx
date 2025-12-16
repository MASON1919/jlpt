// app/payment/success/page.tsx
"use client";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authKey = searchParams.get("authKey");
  const customerKey = searchParams.get("customerKey");
  const isProcessing = useRef(false);

  useEffect(() => {
    if (!authKey || !customerKey) return;
    if (isProcessing.current) return;
    isProcessing.current = true;
    if (authKey && customerKey) {
      fetch("/api/payment/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authKey, customerKey }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("구독 신청이 완료되었습니다!");
            router.push("/"); // 임시로 메인페이지로 (나중에 수정하자)
          } else {
            alert("구독 신청 실패: " + data.error);
          }
        });
    }
  }, [authKey, customerKey]);

  return <div>구독 처리 중입니다...</div>;
}

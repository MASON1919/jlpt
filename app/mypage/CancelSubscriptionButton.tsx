"use client";

import { Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("정말 구독을 해지하시겠습니까? 해지하더라도 남은 기간 동안은 혜택이 유지됩니다.")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/lemonsqueezy/subscription", {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel");
      }

      alert("구독이 해지되었습니다.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("구독 해지 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm font-medium hover:bg-red-100 transition-colors"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
      구독 해지
    </button>
  );
}

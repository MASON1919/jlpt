"use client";

import { Loader2, ExternalLink, Zap } from "lucide-react";
import { useState } from "react";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function MyPageSubscribeButton({ className, children }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("결제 페이지로 이동하는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("결제 페이지로 이동하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={className}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}

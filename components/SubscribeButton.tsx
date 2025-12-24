"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

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
        alert(t.common.paymentError);
      }
    } catch (error) {
      console.error(error);
      alert(t.common.paymentError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full py-4 rounded-xl bg-[#C84B31] text-white font-bold hover:bg-[#A63620] transition-colors shadow-lg shadow-[#C84B31]/30 flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {t.common.subscribe}
    </button>
  );
}


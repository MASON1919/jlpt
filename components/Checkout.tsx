"use client";

import { loadTossPayments } from "@tosspayments/payment-sdk";
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function CheckoutPage() {
  const handlePayment = async () => {
    try {
      const tossPayments = await loadTossPayments(clientKey);
      /*
      await tossPayments.requestPayment("카드", {
        amount: 9900,
        orderId: "ORDER_ID_" + new Date().getTime(),
        orderName: "PRO 이용권",
        customerName: "최선호",
        successUrl: "http://localhost:3000/payment/success",
        failUrl: "http://localhost:3000/payment/fail",
      });*/
      await tossPayments.requestBillingAuth("카드", {
        customerKey: "USER_ID_1234",
        successUrl: "http://localhost:3000/payment/success",
        failUrl: "http://localhost:3000/payment/fail",
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("오류 발생");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 border rounded-lg shadow-md mt-10 text-center">
      <h1 className="text-2xl font-bold mb-8">PRO 이용권 결제</h1>

      <div className="mb-8 p-4 bg-gray-50 rounded">
        <p className="text-lg">상품명: JLPT MASTER PRO 이용권</p>
        <p className="text-xl font-bold text-blue-600 mt-2">가격: 9,900원</p>
      </div>

      <button
        className="w-full bg-blue-500 text-white py-4 rounded-md text-lg font-bold hover:bg-blue-600 transition"
        onClick={handlePayment}
      >
        결제하기
      </button>
    </div>
  );
}

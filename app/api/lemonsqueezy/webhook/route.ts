import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Lemon Squeezy Webhook Secret이 없습니다.");
      return NextResponse.json({ error: "Secret missing" }, { status: 500 });
    }

    // 요청 데이터(Raw Body)와 서명(Signature) 확보
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    // 서명 검증
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      console.error("서명 불일치");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 데이터 파싱
    const payload = JSON.parse(rawBody);
    const { meta, data } = payload;
    const eventName = meta.event_name;
    const userId = meta.custom_data?.user_id;

    // 유저 ID가 없으면 누구 건지 모르니 에러 처리
    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    console.log(`🔔 Webhook: ${eventName} (User: ${userId})`);

    // 이벤트별 DB 업데이트 (Provider 필드 추가됨!)
    switch (eventName) {
      // ✅ 구독 시작 (첫 결제)
      case "subscription_created":
      // ✅ 구독 갱신 (매달 자동 결제)
      case "subscription_updated":
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true, // 유료 회원 등업

            // ★ 핵심: 결제 출처 기록 (나중에 앱 결제랑 구분용)
            subscriptionProvider: "LEMON_SQUEEZY",

            subscriptionId: `${data.id}`, // 레몬스퀴지 구독 ID
            subscriptionStatus: data.attributes.status, // "active"
            currentPeriodEnd: new Date(data.attributes.renews_at), // 다음 결제일
            customerPortalUrl: data.attributes.urls.customer_portal,
          },
        });
        break;

      // 구독 취소 (해지 버튼 누름)
      // (즉시 권한 박탈하지 않고, 상태만 'cancelled'로 변경 -> 만료일까지는 사용 가능하게)
      case "subscription_cancelled":
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: "cancelled",
            // isPro는 건드리지 않습니다. (남은 기간 동안 써야 하니까)
          },
        });
        break;

      // 구독 완전 만료 (기간 끝남 / 결제 실패로 종료)
      case "subscription_expired":
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: false, // 권한 박탈
            subscriptionStatus: "expired",
          },
        });
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("🔥 Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus, SubscriptionEvent } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Lemon Squeezy Webhook Secret이 없습니다.");
      return NextResponse.json({ error: "Secret missing" }, { status: 500 });
    }

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

    const externalId = `${data.id}`;
    const renewsAt = new Date(data.attributes.renews_at);
    const createdAt = new Date(data.attributes.created_at);
    const customerPortalUrl = data.attributes.urls?.customer_portal;

    // Map Lemon Squeezy status to our enum
    const mapStatus = (lsStatus: string): SubscriptionStatus => {
      switch (lsStatus) {
        case "active":
        case "on_trial":
          return "ACTIVE";
        case "cancelled":
          return "CANCELLED";
        case "expired":
          return "EXPIRED";
        case "past_due":
          return "PAST_DUE";
        case "paused":
          return "PAUSED";
        default:
          return "ACTIVE";
      }
    };

    switch (eventName) {
      case "subscription_created": {
        // 구독 생성
        const subscription = await prisma.subscription.create({
          data: {
            userId,
            provider: "LEMON_SQUEEZY",
            externalId,
            status: mapStatus(data.attributes.status),
            currentPeriodStart: createdAt,
            currentPeriodEnd: renewsAt,
            customerPortalUrl,
          },
        });

        // 히스토리 기록
        await prisma.subscriptionHistory.create({
          data: {
            subscriptionId: subscription.id,
            event: "CREATED",
            newStatus: subscription.status,
            metadata: { lemonSqueezyData: data.attributes },
          },
        });

        // User isPro 업데이트
        await prisma.user.update({
          where: { id: userId },
          data: { isPro: true },
        });
        break;
      }

      case "subscription_updated": {
        // 기존 구독 찾기
        const existingSubscription = await prisma.subscription.findFirst({
          where: { externalId },
        });

        if (existingSubscription) {
          const previousStatus = existingSubscription.status;
          const newStatus = mapStatus(data.attributes.status);

          await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              status: newStatus,
              currentPeriodEnd: renewsAt,
              customerPortalUrl,
            },
          });

          // 히스토리 기록 (갱신)
          await prisma.subscriptionHistory.create({
            data: {
              subscriptionId: existingSubscription.id,
              event: "RENEWED",
              previousStatus,
              newStatus,
              metadata: { lemonSqueezyData: data.attributes },
            },
          });

          // User isPro 업데이트 (active면 true)
          await prisma.user.update({
            where: { id: userId },
            data: { isPro: newStatus === "ACTIVE" },
          });
        } else {
          // 구독이 없으면 새로 생성 (fallback)
          const subscription = await prisma.subscription.create({
            data: {
              userId,
              provider: "LEMON_SQUEEZY",
              externalId,
              status: mapStatus(data.attributes.status),
              currentPeriodStart: createdAt,
              currentPeriodEnd: renewsAt,
              customerPortalUrl,
            },
          });

          await prisma.subscriptionHistory.create({
            data: {
              subscriptionId: subscription.id,
              event: "CREATED",
              newStatus: subscription.status,
            },
          });

          await prisma.user.update({
            where: { id: userId },
            data: { isPro: true },
          });
        }
        break;
      }

      case "subscription_cancelled": {
        const subscription = await prisma.subscription.findFirst({
          where: { externalId },
        });

        if (subscription) {
          const previousStatus = subscription.status;

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              status: "CANCELLED",
              cancelledAt: new Date(),
            },
          });

          await prisma.subscriptionHistory.create({
            data: {
              subscriptionId: subscription.id,
              event: "CANCELLED",
              previousStatus,
              newStatus: "CANCELLED",
            },
          });

          // 취소해도 기간 만료 전까지는 isPro 유지
          // (만료 시점에 별도 webhook이 옴)
        }
        break;
      }

      case "subscription_expired": {
        const subscription = await prisma.subscription.findFirst({
          where: { externalId },
        });

        if (subscription) {
          const previousStatus = subscription.status;

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: "EXPIRED" },
          });

          await prisma.subscriptionHistory.create({
            data: {
              subscriptionId: subscription.id,
              event: "EXPIRED",
              previousStatus,
              newStatus: "EXPIRED",
            },
          });

          // 만료되면 권한 박탈
          await prisma.user.update({
            where: { id: userId },
            data: { isPro: false },
          });
        }
        break;
      }

      case "subscription_payment_failed": {
        const subscription = await prisma.subscription.findFirst({
          where: { externalId },
        });

        if (subscription) {
          const previousStatus = subscription.status;

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: "PAST_DUE" },
          });

          await prisma.subscriptionHistory.create({
            data: {
              subscriptionId: subscription.id,
              event: "PAYMENT_FAILED",
              previousStatus,
              newStatus: "PAST_DUE",
              metadata: { lemonSqueezyData: data.attributes },
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

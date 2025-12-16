import { cancelSubscription } from "@/lib/lemonsqueezy";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, subscriptionId: true },
    });

    if (!user || !user.subscriptionId) {
      return NextResponse.json(
        { error: "구독 정보가 없습니다." },
        { status: 400 }
      );
    }

    // Call Lemon Squeezy API
    const response = await cancelSubscription(user.subscriptionId);

    if (response.error) {
        console.error("Lemon Squeezy Cancel Error:", response.error);
        return NextResponse.json({ error: response.error.message }, { status: 500 });
    }

    // Optimistically update local DB (Webhook will confirm later)
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: "cancelled" },
    });

    return NextResponse.json({ data: response.data });
  } catch (error) {
    console.error("Subscription Cancel Error:", error);
    return NextResponse.json(
      { error: "구독 해지 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

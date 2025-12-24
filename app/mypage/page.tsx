import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MyPageClient from "./MyPageClient";

export const metadata = {
  title: "My Page - JLPT Master",
  description: "Manage your profile and subscription.",
};

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isPro: true,
      subscriptions: {
        where: {
          status: { in: ["ACTIVE", "CANCELLED"] },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          provider: true,
          status: true,
          currentPeriodEnd: true,
          customerPortalUrl: true,
          cancelledAt: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const activeSubscription = user.subscriptions[0] || null;
  const isPro = user.isPro;
  const isExpired = isPro && activeSubscription?.currentPeriodEnd 
    ? new Date(activeSubscription.currentPeriodEnd) < new Date() 
    : false;

  return (
    <MyPageClient 
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        isPro: user.isPro,
      }} 
      subscription={activeSubscription ? {
        status: activeSubscription.status,
        currentPeriodEnd: activeSubscription.currentPeriodEnd,
        customerPortalUrl: activeSubscription.customerPortalUrl,
        provider: activeSubscription.provider,
        cancelledAt: activeSubscription.cancelledAt,
      } : null}
      isExpired={isExpired} 
    />
  );
}

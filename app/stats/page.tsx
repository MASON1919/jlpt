import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserStats } from "@/lib/firestore";
import StatsClient from "./StatsClient";

export const metadata = {
  title: "My Statistics - JLPT Master",
  description: "View your problem-solving statistics and performance.",
};

export default async function StatsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      targetLevel: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch stats from Firestore
  let stats = {};
  try {
    const rawStats = await getUserStats(user.id);
    // Convert Firestore Timestamps to ISO strings for serialization
    stats = Object.fromEntries(
      Object.entries(rawStats).map(([level, levelStats]) => [
        level,
        {
          ...levelStats,
          lastUpdated: levelStats.lastUpdated?.toDate?.()?.toISOString() || null,
        },
      ])
    );
  } catch (error) {
    console.error("Error fetching user stats:", error);
    // Continue with empty stats
  }

  return (
    <StatsClient
      userName={user.name || "User"}
      targetLevel={user.targetLevel}
      stats={stats}
    />
  );
}

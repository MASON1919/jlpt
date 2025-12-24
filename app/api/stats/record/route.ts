import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateProblemStats, ProblemType, ProblemSubType } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { level, problemType, problemSubType, isCorrect, userId } = body;

    // Validate required fields
    if (!level || !problemType || !problemSubType || typeof isCorrect !== "boolean" || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: level, problemType, problemSubType, isCorrect, userId" },
        { status: 400 }
      );
    }

    // Validate level range
    if (typeof level !== "number" || level < 1 || level > 5) {
      return NextResponse.json(
        { error: "Invalid level. Must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Update stats in Firestore
    await updateProblemStats(
      userId,
      level,
      problemType as ProblemType,
      problemSubType as ProblemSubType,
      isCorrect
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording stats:", error);
    return NextResponse.json(
      { error: "Failed to record statistics" },
      { status: 500 }
    );
  }
}

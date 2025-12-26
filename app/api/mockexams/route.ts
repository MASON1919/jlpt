import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all published mock exams (public API)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get("level");

    const where: { level?: number } = {};
    if (level) where.level = parseInt(level);

    const mockExams = await prisma.mockExam.findMany({
      where,
      select: {
        id: true,
        title: true,
        level: true,
        createdAt: true,
        _count: {
          select: { problems: true },
        },
      },
      orderBy: { id: "desc" },
    });

    // Only return exams with at least one problem
    const examsWithProblems = mockExams.filter(exam => exam._count.problems > 0);

    return NextResponse.json({ mockExams: examsWithProblems });
  } catch (error) {
    console.error("Failed to fetch mock exams:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

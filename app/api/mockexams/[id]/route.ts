import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch a mock exam with all problems for solving
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockExamId = parseInt(id);

    if (isNaN(mockExamId)) {
      return NextResponse.json({ error: "Invalid mock exam ID" }, { status: 400 });
    }

    const mockExam = await prisma.mockExam.findUnique({
      where: { id: mockExamId },
      include: {
        problems: {
          select: {
            id: true,
            level: true,
            type: true,
            subType: true,
            content: true,
            question: true,
            options: true,
            answerIndex: true,
            explanation: true,
            vocab: true,
          },
          orderBy: [{ type: "asc" }, { subType: "asc" }],
        },
      },
    });

    if (!mockExam) {
      return NextResponse.json({ error: "Mock exam not found" }, { status: 404 });
    }

    // Transform problems to match expected format
    const problems = mockExam.problems.map((p, index) => ({
      id: p.id,
      number: index + 1,
      level: p.level,
      type: p.type,
      subType: p.subType,
      question: {
        jp: p.question,
        ko: p.question,
      },
      content: {
        layout: "text",
        sentences: ((p.content || "") as string).split("\n").map((line: string) => ({
          original: line,
          trans: { ko: line, en: line },
        })),
      },
      options: (p.options as string[]).map((opt: string, idx: number) => ({
        id: idx + 1,
        text: { jp: opt, ko: opt, en: opt },
      })),
      answerIndex: p.answerIndex,
      explanation: p.explanation as { ko: string; en?: string },
      vocab: p.vocab as { word: string; reading: string; meaning: { ko: string; en?: string } }[] | undefined,
    }));

    return NextResponse.json({
      mockExam: {
        id: mockExam.id,
        title: mockExam.title,
        level: mockExam.level,
      },
      problems,
      totalProblems: problems.length,
    });
  } catch (error) {
    console.error("Failed to fetch mock exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

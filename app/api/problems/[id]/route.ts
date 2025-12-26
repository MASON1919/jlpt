import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch a single problem by ID (for preview)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const problemId = parseInt(id);

    if (isNaN(problemId)) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Transform data to match expected format for solve page
    const contentStr = (problem.content || "") as string;
    const transformedProblem = {
      id: problem.id,
      level: problem.level,
      type: problem.type,
      subType: problem.subType,
      question: {
        jp: problem.question,
        ko: problem.question,
      },
      content: {
        layout: "text",
        sentences: contentStr.split("\n").map((line: string) => ({
          original: line,
          trans: { ko: line, en: line },
        })),
      },
      options: (problem.options as string[]).map((opt: string, idx: number) => ({
        id: idx + 1,
        text: { jp: opt, ko: opt, en: opt },
      })),
      answerIndex: problem.answerIndex,
      explanation: problem.explanation as { ko: string; en?: string },
      vocab: problem.vocab as { word: string; reading: string; meaning: { ko: string; en?: string } }[] | undefined,
    };

    return NextResponse.json(transformedProblem);
  } catch (error) {
    console.error("Failed to fetch problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

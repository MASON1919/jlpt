import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { ProblemType, ProblemSubType } from "@prisma/client";

// Valid enum values for validation
const PROBLEM_TYPES = ["VOCAB", "GRAMMAR", "READING", "LISTENING"];
const PROBLEM_SUB_TYPES = [
  "KANJI_READING",
  "ORTHOGRAPHY",
  "WORD_FORMATION",
  "CONTEXT",
  "PARAPHRASE",
  "USAGE",
  "GRAMMAR_FORM",
  "GRAMMAR_ORDER",
  "TEXT_GRAMMAR",
  "SHORT_PASSAGE",
  "MID_PASSAGE",
  "LONG_PASSAGE",
  "INTEGRATED_PASSAGE",
  "THEMATIC_PASSAGE",
  "INFO_RETRIEVAL",
  "TASK_BASED",
  "POINT_COMPREHENSION",
  "SUMMARY",
  "QUICK_RESPONSE",
  "INTEGRATED_COMPREHENSION",
];

// GET - Fetch problems with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get("level");
    const type = searchParams.get("type");
    const excludeAssigned = searchParams.get("excludeAssigned") === "true";

    const where: { level?: number; type?: ProblemType; mockExamId?: null } = {};
    if (level) where.level = parseInt(level);
    if (type && PROBLEM_TYPES.includes(type)) where.type = type as ProblemType;
    if (excludeAssigned) where.mockExamId = null; // Only unassigned problems

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        select: {
          id: true,
          level: true,
          type: true,
          subType: true,
          content: true,
          question: true,
          mockExamId: true,
          createdAt: true,
        },
        orderBy: { id: "desc" },
        take: 50,
      }),
      prisma.problem.count({ where }),
    ]);

    return NextResponse.json({ problems, total });
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const { level, type, subType, content, options, answerIndex, explanation, vocab, reasoning_for_level } = body;

    if (typeof level !== "number" || level < 1 || level > 5) {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
    }

    if (!PROBLEM_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    if (!PROBLEM_SUB_TYPES.includes(subType)) {
      return NextResponse.json({ error: "Invalid subType" }, { status: 400 });
    }

    if (!content || typeof content !== "object") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json({ error: "Options must be an array of 4 items" }, { status: 400 });
    }

    if (typeof answerIndex !== "number" || answerIndex < 0 || answerIndex > 3) {
      return NextResponse.json({ error: "Invalid answerIndex" }, { status: 400 });
    }

    if (!explanation || typeof explanation.ko !== "string") {
      return NextResponse.json({ error: "explanation.ko is required" }, { status: 400 });
    }

    // Convert content to string for the new schema
    // The schema now stores content as a simple String, but we'll store the JSON stringified version
    // or we can serialize it differently based on the layout
    let contentString = "";
    if (content.layout === "text" && content.sentences) {
      contentString = content.sentences.map((s: { original: string }) => s.original).join("\n");
    } else {
      contentString = JSON.stringify(content);
    }

    // Convert question from content (for text layout, use the first sentence)
    let questionString = "";
    if (content.layout === "text" && content.sentences && content.sentences.length > 0) {
      questionString = content.sentences[0].original;
    }

    // Convert options to simple array format for new schema
    const optionsArray = options.map((opt: { id: number; text: { jp: string } }) => opt.text.jp);

    // Create problem in database
    const problem = await prisma.problem.create({
      data: {
        level,
        type: type as ProblemType,
        subType: subType as ProblemSubType,
        content: contentString,
        question: questionString,
        options: optionsArray,
        answerIndex,
        explanation: explanation,
        vocab: vocab || null,
        reasoning_for_level: reasoning_for_level || null,
      },
    });

    return NextResponse.json({ success: true, id: problem.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create problem:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

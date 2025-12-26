import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { ProblemType, ProblemSubType } from "@prisma/client";

// GET - Fetch single problem
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const problem = await prisma.problem.findUnique({
      where: { id: parseInt(id) },
      include: {
        mockExam: {
          select: { id: true, title: true },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json({ problem });
  } catch (error) {
    console.error("Failed to fetch problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update problem
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    const {
      level,
      type,
      subType,
      content,
      question,
      options,
      answerIndex,
      explanation,
      vocab,
      reasoning_for_level,
      mockExamId,
    } = body;

    const problem = await prisma.problem.update({
      where: { id: parseInt(id) },
      data: {
        level,
        type: type as ProblemType,
        subType: subType as ProblemSubType,
        content,
        question,
        options,
        answerIndex,
        explanation,
        vocab: vocab || null,
        reasoning_for_level: reasoning_for_level || null,
        mockExamId: mockExamId || null,
      },
    });

    return NextResponse.json({ success: true, problem });
  } catch (error) {
    console.error("Failed to update problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete problem
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await prisma.problem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

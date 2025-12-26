import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all mock exams
export async function GET() {
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

    const mockExams = await prisma.mockExam.findMany({
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

    return NextResponse.json({ mockExams });
  } catch (error) {
    console.error("Failed to fetch mock exams:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new mock exam
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, level } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (typeof level !== "number" || level < 1 || level > 5) {
      return NextResponse.json({ error: "Level must be 1-5" }, { status: 400 });
    }

    const mockExam = await prisma.mockExam.create({
      data: { title, level },
    });

    return NextResponse.json({ success: true, mockExam }, { status: 201 });
  } catch (error) {
    console.error("Failed to create mock exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


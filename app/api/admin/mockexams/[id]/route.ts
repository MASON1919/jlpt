import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch single mock exam with problems
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
    const mockExam = await prisma.mockExam.findUnique({
      where: { id: parseInt(id) },
      include: {
        problems: {
          select: {
            id: true,
            level: true,
            type: true,
            subType: true,
            content: true,
            question: true,
          },
          orderBy: [{ type: "asc" }, { subType: "asc" }],
        },
      },
    });

    if (!mockExam) {
      return NextResponse.json({ error: "Mock exam not found" }, { status: 404 });
    }

    return NextResponse.json({ mockExam });
  } catch (error) {
    console.error("Failed to fetch mock exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update mock exam
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
    const { title, level } = body;

    const mockExam = await prisma.mockExam.update({
      where: { id: parseInt(id) },
      data: { title, level },
    });

    return NextResponse.json({ success: true, mockExam });
  } catch (error) {
    console.error("Failed to update mock exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete mock exam
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
    
    // First, remove all problem associations
    await prisma.problem.updateMany({
      where: { mockExamId: parseInt(id) },
      data: { mockExamId: null },
    });
    
    // Then delete the mock exam
    await prisma.mockExam.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete mock exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

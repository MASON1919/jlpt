import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProblemType } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get("level");
  const type = searchParams.get("type");

  if (!level || !type) {
    return NextResponse.json(
      { error: "Level and type are required" },
      { status: 400 }
    );
  }

  try {
    // 1. 해당 조건의 문제 개수 확인
    const count = await prisma.problem.count({
      where: {
        level: parseInt(level),
        type: type.toUpperCase() as ProblemType,
      },
    });

    if (count === 0) {
      return NextResponse.json(
        { error: "No problems found for the given criteria" },
        { status: 404 }
      );
    }

    // 2. 랜덤 오프셋 생성
    const skip = Math.floor(Math.random() * count);

    // 3. 랜덤 문제 1개 조회
    const problems = await prisma.problem.findMany({
      where: {
        level: parseInt(level),
        type: type.toUpperCase() as ProblemType,
      },
      take: 1,
      skip: skip,
    });

    return NextResponse.json(problems[0]);
  } catch (error) {
    console.error("Failed to fetch problem:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

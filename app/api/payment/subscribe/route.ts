import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { authKey, customerKey } = await req.json();
  const secretKey = process.env.TOSS_SECRET_KEY!;

  const response = await fetch(
    "https://api.tosspayments.com/v1/billing/authorizations/issue",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString(
          "base64"
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    }
  );

  if (!response.ok) {
    return NextResponse.json({ error: "빌링키 발급 실패" }, { status: 400 });
  }

  const data = await response.json();
  const billingKey = data.billingKey;

  console.log("발급된 빌링키:", billingKey);
  return NextResponse.json({ success: true, billingKey });
}

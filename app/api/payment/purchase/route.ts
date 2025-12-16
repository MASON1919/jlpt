import { NextResponse } from "next/server";
const secretKey = process.env.TOSS_SECRET_KEY!;
export async function POST(req: Request) {
  const { billingKey, amount, orderId, orderName } = await req.json();
  const url = `https://api.tosspayments.com/v1/billing/${billingKey}`;
}

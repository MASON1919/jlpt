
import { createCheckout } from "@/lib/lemonsqueezy";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;

    const checkout = await createCheckout(
      storeId,
      variantId,
      {
        //구매지 정보
        checkoutData: {
          email: session.user.email ?? undefined,
          name: session.user.name ?? undefined,
          custom: {
            user_id: session.user.id || "",
          },
        },
        productOptions: {
          //결제 성공후 들어올 주소
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
          receiptButtonText: "Go to Dashboard",
          receiptThankYouNote: "Thank you for subscribing!",
        },
      }
    );

    if (checkout.error) {
        console.error(checkout.error);
        return NextResponse.json({ error: checkout.error.message }, { status: 500 });
    }

    return NextResponse.json({ url: checkout.data?.data.attributes.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred creating the checkout." },
      { status: 500 }
    );
  }
}

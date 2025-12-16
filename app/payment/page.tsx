import Checkout from "@/components/Checkout";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
export default async function PaymentPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="max-w-xl mx-auto p-10 border rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-4">결제</h1>
        <p>결제를 진행하려면 먼저 로그인해야 합니다.</p>
      </div>
    );
  }

  return <Checkout />;
}

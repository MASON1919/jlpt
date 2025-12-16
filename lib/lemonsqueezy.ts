
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export const configureLemonSqueezy = () => {
  const requiredVars = [
    "LEMONSQUEEZY_API_KEY",
    "LEMONSQUEEZY_STORE_ID",
    "LEMONSQUEEZY_VARIANT_ID",
  ];

  const missingVars = requiredVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Lemon Squeezy environment variables: ${missingVars.join(
        ", "
      )}`
    );
  }

  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
    onError: (error) => console.error("Lemon Squeezy Error: ", error),
  });
};
configureLemonSqueezy();
export * from "@lemonsqueezy/lemonsqueezy.js";
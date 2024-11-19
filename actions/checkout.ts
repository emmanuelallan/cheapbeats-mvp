"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateToken } from "@/lib/utils";

const CheckoutSchema = z.object({
  beatId: z.string(),
  licenseId: z.string(),
  addonIds: z.array(z.string()),
});

export async function createCheckout(data: z.infer<typeof CheckoutSchema>) {
  try {
    const [beat, license, addons] = await Promise.all([
      prisma.beat.findUnique({
        where: { id: data.beatId },
      }),
      prisma.license.findUnique({
        where: { id: data.licenseId },
      }),
      prisma.addon.findMany({
        where: {
          id: { in: data.addonIds },
        },
      }),
    ]);

    if (!beat || !license) {
      throw new Error("Invalid beat or license");
    }

    const totalAmount =
      license.basePrice + addons.reduce((sum, addon) => sum + addon.price, 0);
    const downloadToken = generateToken();

    // Create Lemon Squeezy checkout
    const checkoutResponse = await fetch(
      "https://api.lemonsqueezy.com/v1/checkouts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              store_id: process.env.LEMON_SQUEEZY_STORE_ID,
              variant_id: process.env.LEMON_SQUEEZY_VARIANT_ID,
              custom_price: Math.round(totalAmount * 100), // Convert to cents
              checkout_data: {
                beatId: beat.id,
                licenseId: license.id,
                addonIds: data.addonIds,
                downloadToken,
              },
            },
          },
        }),
      }
    );

    const checkoutData = await checkoutResponse.json();

    return {
      checkoutUrl: checkoutData.data.attributes.url,
    };
  } catch (error) {
    console.error("Checkout error:", error);
    throw new Error("Failed to create checkout");
  }
}

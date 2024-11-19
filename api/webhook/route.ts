import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import crypto from "crypto";
import { LicenseType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // Verify webhook signature
    const headersList = await headers();
    const signature = headersList.get("x-signature");
    const body = await req.text();
    const hmac = crypto
      .createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== hmac) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle order.created event
    if (event.meta.event_name === "order.created") {
      const {
        customer_email,
        checkout_data: { beatId, licenseId, addonIds, downloadToken },
        total_formatted,
      } = event.data.attributes;

      const [license, addons] = await Promise.all([
        prisma.license.findUnique({
          where: { id: licenseId },
        }),
        prisma.addon.findMany({
          where: {
            id: { in: addonIds },
          },
        }),
      ]);

      if (!license) {
        throw new Error("License not found");
      }

      // Create purchase record with customer details
      await prisma.purchase.create({
        data: {
          beatId,
          licenseType: license.name.toUpperCase() as LicenseType,
          customerEmail: customer_email,
          downloadToken,
          amount: parseFloat(total_formatted),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          transactionId: event.data.id,
          addons: {
            create: addons.map((addon) => ({
              type: addon.name.toUpperCase() as "STEMS" | "MIDI",
              price: addon.price,
              name: addon.name,
              description: addon.name,
              downloadUrl: `${
                process.env.DOWNLOAD_BASE_URL
              }/${addon.name.toLowerCase()}/${beatId}`,
            })),
          },
        },
      });
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}

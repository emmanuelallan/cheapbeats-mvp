import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { capturePayPalOrder, generateDownloadToken } from "@/lib/paypal";
import { Resend } from "resend";
import PurchaseConfirmationEmail from "@/lib/emails/purchase-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { orderID } = await request.json();

  try {
    // Get the order from our database
    const order = await prisma.order.findUnique({
      where: { paypalOrderId: orderID },
      include: { beat: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Capture the PayPal payment
    const captureData = await capturePayPalOrder(orderID);

    // Generate download token and expiry date
    const downloadToken = generateDownloadToken();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now

    // Create the purchase record
    const purchase = await prisma.purchase.create({
      data: {
        beatId: order.beatId,
        licenseType: order.licenseType,
        customerEmail: captureData.payer.email_address,
        downloadToken,
        expiresAt: expiryDate,
        amount: order.amount,
        transactionId: captureData.id,
        addons: {
          create: order.addons.map((addonType) => ({
            type: addonType as "STEMS" | "MIDI",
            price: addonType === "STEMS" ? 200 : 100, // Use your actual addon prices
            downloadUrl:
              addonType === "STEMS"
                ? order.beat.stemsUrl!
                : order.beat.midiUrl!,
          })),
        },
      },
      include: {
        beat: true,
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED" },
    });

    // Send confirmation email
    const downloadPageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/download/${downloadToken}`;

    await resend.emails.send({
      from: "beats@yourdomain.com",
      to: captureData.payer.email_address,
      subject: `Your beat purchase: ${order.beat.title}`,
      react: PurchaseConfirmationEmail({
        customerName: captureData.payer.email_address.split("@")[0],
        beatTitle: order.beat.title,
        downloadPageUrl,
        expiryDate: expiryDate.toLocaleDateString(),
      }),
    });

    return NextResponse.json({
      success: true,
      downloadPageUrl,
      purchaseId: purchase.id,
    });
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

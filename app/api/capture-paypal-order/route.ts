import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { capturePayPalOrder, generateDownloadToken } from "@/lib/paypal";
import { Resend } from "resend";
import PurchaseConfirmationEmail from "@/lib/emails/purchase-confirmation";
import { OrderStatus } from "@prisma/client";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function POST(request: Request) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json(
        { error: "Missing order ID" },
        { status: 400 }
      );
    }

    // Get the order from our database
    const order = await prisma.order.findUnique({
      where: { paypalOrderId: orderID },
      include: { beat: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    try {
      // Capture the PayPal payment
      const captureData = await capturePayPalOrder(orderID);

      // Generate download token and expiry date
      const downloadToken = generateDownloadToken();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Create the purchase record with proper addon handling
      const purchase = await prisma.purchase.create({
        data: {
          beatId: order.beatId,
          orderId: order.id,
          licenseType: order.licenseType,
          customerEmail: captureData.payer.email_address,
          downloadToken,
          expiresAt: expiryDate,
          amount: order.amount,
          transactionId: captureData.id,
          addons: {
            create: order.addons.map((addonType) => ({
              type: addonType as "STEMS" | "MIDI",
              price: addonType === "STEMS" ? 200 : 100,
              downloadUrl: addonType === "STEMS" 
                ? order.beat.stemsUrl!
                : order.beat.midiUrl!,
            })),
          },
        },
        include: {
          beat: true,
          addons: true, // Include addons in the response
        },
      });

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: OrderStatus.COMPLETED,
          customerEmail: captureData.payer.email_address
        },
      });

      const downloadPageUrl = `${process.env.NEXT_PUBLIC_URL}/download/${downloadToken}`;

      try {
        // Send confirmation email
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: captureData.payer.email_address,
          subject: `Your beat purchase: ${order.beat.title}`,
          react: PurchaseConfirmationEmail({
            customerName: captureData.payer.email_address.split("@")[0],
            beatTitle: order.beat.title,
            downloadPageUrl,
            expiryDate: expiryDate.toLocaleDateString(),
          }),
        });
      } catch (emailError) {
        // Log email error but don't fail the purchase
        console.error("Failed to send confirmation email:", emailError);
      }

      return NextResponse.json({
        success: true,
        downloadPageUrl,
        purchaseId: purchase.id,
      });
    } catch (captureError) {
      console.error("PayPal capture error:", captureError);
      
      // Update order status to failed
      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.FAILED },
      });

      throw captureError;
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

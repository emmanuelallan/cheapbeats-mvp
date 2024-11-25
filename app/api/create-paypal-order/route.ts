import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";
import { OrderStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { beatId, licenseId, addonIds, amount } = body;

    // Validate all required fields
    if (!beatId || typeof beatId !== "string") {
      return NextResponse.json(
        { error: "Invalid beat ID" },
        { status: 400 }
      );
    }

    if (!licenseId || typeof licenseId !== "string") {
      console.log('Invalid license ID:', licenseId);
      return NextResponse.json(
        { error: "Invalid license ID" },
        { status: 400 }
      );
    }

    if (!Array.isArray(addonIds)) {
      return NextResponse.json(
        { error: "Invalid addons data" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Fetch and validate beat
    const beat = await prisma.beat.findUnique({
      where: { id: beatId, isActive: true },
    });

    if (!beat) {
      return NextResponse.json(
        { error: "Beat not found or inactive" },
        { status: 404 }
      );
    }

    // Fetch and validate license to get the name
    const license = await prisma.license.findUnique({
      where: { id: licenseId, isActive: true },
    });

    if (!license) {
      return NextResponse.json(
        { error: "License not found or inactive" },
        { status: 404 }
      );
    }

    // The license.name is already a LicenseType enum value from the database
    // so we don't need to map it
    const licenseType = license.name;

    // Remove the mapping code and validation
    // Just log for debugging
    console.log({
      licenseId,
      licenseName: license.name,
      licenseType,
    });

    // Create PayPal order first
    const paypalOrder = await createPayPalOrder(amount);

    // Store order details
    const order = await prisma.order.create({
      data: {
        paypalOrderId: paypalOrder.id,
        beatId: beat.id,
        licenseType,
        amount,
        status: OrderStatus.PENDING,
        customerEmail: "", // Will be updated after capture
        addons: addonIds,
      },
    });

    return NextResponse.json({
      id: paypalOrder.id,
      orderId: order.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

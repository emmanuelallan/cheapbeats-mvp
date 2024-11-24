import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";
import { LicenseType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { beatId, licenseId, addonIds, amount } = await request.json();

    if (
      !beatId ||
      !licenseId ||
      !Array.isArray(addonIds) ||
      typeof amount !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Fetch the beat to ensure it exists and is active
    const beat = await prisma.beat.findUnique({
      where: { id: beatId, isActive: true },
    });

    if (!beat) {
      return NextResponse.json(
        { error: "Beat not found or inactive" },
        { status: 404 }
      );
    }

    // Fetch the license to ensure it exists and is active
    const license = await prisma.license.findUnique({
      where: { id: licenseId, isActive: true },
    });

    if (!license) {
      return NextResponse.json(
        { error: "License not found or inactive" },
        { status: 404 }
      );
    }

    // Fetch and validate addons
    const addons = await prisma.addon.findMany({
      where: { id: { in: addonIds }, isActive: true },
    });

    if (addons.length !== addonIds.length) {
      return NextResponse.json(
        { error: "One or more addons not found or inactive" },
        { status: 404 }
      );
    }

    // Calculate total amount
    const calculatedAmount =
      license.basePrice + addons.reduce((sum, addon) => sum + addon.price, 0);

    // Verify the amount matches what the client sent
    if (Math.abs(calculatedAmount - amount) > 0.01) {
      // Allow for small floating-point discrepancies
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(calculatedAmount);

    // Store the order details in your database
    const order = await prisma.order.create({
      data: {
        paypalOrderId: paypalOrder.id,
        beatId: beat.id,
        licenseType: license.name as LicenseType,
        amount: calculatedAmount,
        status: "PENDING",
        customerEmail: "", // This will be filled when the order is captured
        addons: addons.map((addon) => addon.type),
      },
    });

    return NextResponse.json({ id: paypalOrder.id, orderId: order.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

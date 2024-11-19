"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addToWaitlist(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const newWaitlistEntry = await prisma.waitlist.create({
      data: { email },
    });
    return { success: true, data: newWaitlistEntry };
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return { error: "Failed to join waitlist. Please try again." };
  } finally {
    await prisma.$disconnect();
  }
}

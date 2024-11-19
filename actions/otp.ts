"use server";

import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { createAdminSession } from "@/lib/session";
import { randomBytes } from "crypto";
import type { ServerActionResponse } from "@/types";
import { OtpVerificationEmail } from "@/components/auth/otpEmail";

const prisma = new PrismaClient();
const resend = new Resend(process.env.AUTH_RESEND_KEY);

function generateSecureOTP(length: number = 6): string {
  const buffer = randomBytes(length);
  const numbers = Array.from(buffer)
    .map((byte) => byte % 10)
    .join("")
    .slice(0, length);

  return numbers.padStart(length, "0");
}

export async function requestOtp(email: string): ServerActionResponse<true> {
  try {
    // Check if user exists and is an admin
    const user = await prisma.user.findUnique({
      where: {
        email,
        role: "ADMIN",
      },
    });

    if (!user) {
      return { error: "Invalid admin email" };
    }

    const otp = generateSecureOTP(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otpVerification.upsert({
      where: { email },
      update: { otp, expiresAt, verified: false },
      create: { email, otp, expiresAt },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Your Admin Login OTP",
      react: OtpVerificationEmail({ otp }),
    });

    return { success: true };
  } catch (error) {
    console.error(
      "OTP Request Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return { error: "Failed to send OTP" };
  }
}

export async function verifyOtp(
  email: string,
  code: string
): ServerActionResponse<true> {
  try {
    const verification = await prisma.otpVerification.findUnique({
      where: { email },
    });

    if (!verification) {
      return { error: "Invalid verification attempt" };
    }

    if (verification.verified) {
      return { error: "Code already used" };
    }

    if (new Date() > verification.expiresAt) {
      return { error: "Code has expired" };
    }

    if (verification.otp !== code) {
      return { error: "Invalid code" };
    }

    await prisma.otpVerification.update({
      where: { email },
      data: { verified: true },
    });

    await createAdminSession(email);

    return { success: true };
  } catch (error) {
    console.error(
      "OTP Verification Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return { error: "Failed to verify OTP" };
  }
}

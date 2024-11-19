import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import prisma from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import crypto from "crypto";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM,
      generateVerificationToken: async () => {
        // Generate 6-digit OTP using crypto
        const otp = crypto
          .randomBytes(3) // 3 bytes = 6 hex characters
          .toString("hex")
          .toUpperCase()
          .slice(0, 6);
        return otp;
      },
      sendVerificationRequest: async ({
        identifier: email,
        provider,
        token,
      }) => {
        // Save OTP to database
        await prisma.otpVerification.create({
          data: {
            email,
            otp: token,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          },
        });

        // Send OTP email
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: "Your verification code",
            html: `Your OTP is: ${token}. It will expire in 10 minutes.`,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, email }) {
      return user.email === process.env.ADMIN_EMAIL;
    },
  },
});

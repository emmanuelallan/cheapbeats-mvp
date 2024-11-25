"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function downloadFile(url: string, filename: string) {
  try {
    // Verify the URL is from your R2 bucket
    if (!url.startsWith(process.env.CLOUDFLARE_R2_PUBLIC_URL!)) {
      throw new Error("Invalid download URL");
    }

    // Generate a signed URL or handle the download logic
    // For now, we'll just return the URL
    return url;
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

export async function verifyDownloadToken(token: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { downloadToken: token },
  });

  if (!purchase || new Date() > purchase.expiresAt) {
    redirect("/404");
  }

  return purchase;
}
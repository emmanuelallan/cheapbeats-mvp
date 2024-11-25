"use server";

import prisma from "@/lib/prisma";

export async function getLicenses() {
  try {
    const licenses = await prisma.license.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        basePrice: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        basePrice: true,
        rights: true,
        allowsStems: true,
      },
    });

    console.log('Fetched licenses:', licenses);
    return licenses;
  } catch (error) {
    console.error("Error fetching licenses:", error);
    throw new Error("Failed to fetch licenses");
  }
}
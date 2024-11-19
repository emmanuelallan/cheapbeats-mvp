"use server";

import prisma from "@/lib/prisma";

export async function getAddons() {
  try {
    const addons = await prisma.addon.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    return addons;
  } catch (error) {
    console.error("Error fetching addons:", error);
    throw new Error("Failed to fetch addons");
  }
}

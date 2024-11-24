import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.license.deleteMany();
  await prisma.addon.deleteMany();

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Create Licenses
  const licenses = await Promise.all([
    prisma.license.create({
      data: {
        name: "Non-Exclusive",
        description:
          "Licensed to multiple artists for limited release with likeness rights",
        basePrice: 19.99,
        rights: [
          "Licensed to multiple artists",
          "For limited release",
          "With likeness rights",
        ],
        allowsStems: false,
        isActive: true,
      },
    }),
    prisma.license.create({
      data: {
        name: "Exclusive",
        description:
          "Removed from store after purchase, for broad commercial use with shared publishing",
        basePrice: 99.0,
        rights: [
          "Removed from store after purchase",
          "For broad commercial use",
          "Share publishing with producer",
          "No reporting or payout to producer",
          "You own the master of the final song",
          "With likeness rights",
        ],
        allowsStems: true,
        isActive: true,
      },
    }),
    prisma.license.create({
      data: {
        name: "Buyout",
        description: "Full rights transfer with complete ownership",
        basePrice: 599.0,
        rights: [
          "Removed from store after purchase",
          "For broad commercial use",
          "Keep 100% of publishing",
          "No reporting or payouts to producer",
          "You own the master of the final song",
          "With likeness rights",
        ],
        allowsStems: true,
        isActive: true,
      },
    }),
  ]);

  // Create Addons
  const addons = await Promise.all([
    prisma.addon.create({
      data: {
        name: "Stems",
        description: "Get the stems of the track in addition to the WAV file",
        price: 200.0,
        type: "STEMS",
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        name: "MIDI",
        description: "Get the MIDI of the track in addition to the WAV file",
        price: 100.0,
        type: "MIDI",
        isActive: true,
      },
    }),
  ]);

  console.log({ admin, licenses, addons });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

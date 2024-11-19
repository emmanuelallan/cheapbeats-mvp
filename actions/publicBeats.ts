"use server";

import prisma from "@/lib/prisma";
import { ADDON_PRICES, PublicBeat } from "@/types";
import { z } from "zod";

const ITEMS_PER_PAGE = 12;

const QuerySchema = z.object({
  page: z.number().default(1),
  search: z.string().default(""),
  genre: z.string().default(""),
  trackType: z.string().default(""),
  minPrice: z.number().default(0),
  maxPrice: z.number().default(1000),
});

export async function getPublicBeats({
  page,
  search,
  genre,
  trackType,
  minPrice,
  maxPrice,
}: z.infer<typeof QuerySchema>) {
  try {
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { beatNumber: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(genre && {
        genres: { contains: genre, mode: "insensitive" as const },
      }),
      ...(trackType && { trackType }),
      nonExclusivePrice: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    const [totalBeats, beats] = await Promise.all([
      prisma.beat.count({ where }),
      prisma.beat.findMany({
        where,
        select: {
          id: true,
          title: true,
          beatNumber: true,
          coverImageUrl: true,
          previewMp3Url: true,
          bpm: true,
          key: true,
          genres: true,
          tags: true,
          trackType: true,
          duration: true,
          createdAt: true,
          nonExclusivePrice: true,
          exclusivePrice: true,
          buyoutPrice: true,
          stemsUrl: true,
          midiUrl: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
    ]);

    const publicBeats = beats.map(({ stemsUrl, midiUrl, ...beat }) => ({
      ...beat,
      beatAddons: [
        ...(stemsUrl
          ? [{ type: "STEMS" as const, price: ADDON_PRICES.STEMS }]
          : []),
        ...(midiUrl
          ? [{ type: "MIDI" as const, price: ADDON_PRICES.MIDI }]
          : []),
      ],
      nonExclusivePrice: beat.nonExclusivePrice,
      exclusivePrice: beat.exclusivePrice,
      buyoutPrice: beat.buyoutPrice,
    })) satisfies PublicBeat[];

    return {
      beats: publicBeats,
      hasMore: totalBeats > page * ITEMS_PER_PAGE,
      totalBeats,
    };
  } catch (error) {
    console.error("Error fetching beats:", error);
    throw new Error("Failed to fetch beats");
  }
}

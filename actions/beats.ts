"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Beat } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";

const beatSchema = z.object({
  title: z.string().min(1, "Title is required"),
  bpm: z.number().min(1).max(300, "BPM must be between 1 and 300"),
  key: z.string().min(1, "Key is required"),
  genres: z.string().min(1, "Genre is required"),
  trackType: z.string().min(1, "Track type is required"),
  tags: z.array(z.string()),
  duration: z.number().min(1, "Duration is required"),
  coverImageUrl: z.string().url(),
  previewMp3Url: z.string().url(),
  wavUrl: z.string().url(),
  stemsUrl: z.string().url().optional(),
  midiUrl: z.string().url().optional(),
  nonExclusivePrice: z
    .number()
    .min(4.99, "Non-exclusive price must be at least $4.99")
    .max(19.99, "Non-exclusive price cannot exceed $19.99"),
  exclusivePrice: z
    .number()
    .min(99, "Exclusive price must be at least $99")
    .max(599, "Exclusive price cannot exceed $599"),
  buyoutPrice: z
    .number()
    .min(599, "Buyout price must be at least $599")
    .max(4999, "Buyout price cannot exceed $4999"),
  isActive: z.boolean().default(true),
});

type CreateBeatInput = z.infer<typeof beatSchema>;

function generateBeatNumber(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
}

async function deleteR2File(url: string) {
  try {
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
    const urlPath = new URL(url).pathname;
    const key = urlPath.split("/").slice(1).join("/"); // Remove leading slash

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
  } catch (error) {
    console.error("Failed to delete file from R2:", error);
  }
}

export async function getBeats() {
  try {
    const beats = await prisma.beat.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        purchases: true,
      },
    });
    return { beats, error: null };
  } catch (error) {
    console.error("Database error:", error);
    return { beats: [], error: "Failed to fetch beats" };
  }
}

export async function createBeat(data: CreateBeatInput) {
  try {
    const beatNumber = generateBeatNumber();
    const validatedData = beatSchema.parse(data);

    const beat = await prisma.beat.create({
      data: {
        ...validatedData,
        beatNumber,
        tags: validatedData.tags,
      },
    });

    revalidatePath("/admin");
    return { beat };
  } catch (error) {
    console.error("Error creating beat:", error);
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw new Error("Failed to create beat");
  }
}

export async function deleteBeat(id: string) {
  try {
    // First fetch the beat to get file URLs
    const beat = await prisma.beat.findUnique({
      where: { id },
    });

    if (!beat) {
      return { error: "Beat not found" };
    }

    // Delete files from R2
    await Promise.all([
      beat.coverImageUrl && deleteR2File(beat.coverImageUrl),
      beat.previewMp3Url && deleteR2File(beat.previewMp3Url),
      beat.wavUrl && deleteR2File(beat.wavUrl),
      beat.stemsUrl && deleteR2File(beat.stemsUrl),
      beat.midiUrl && deleteR2File(beat.midiUrl),
    ]);

    // Delete beat from database
    await prisma.beat.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete beat" };
  }
}

export async function updateBeat(id: string, data: Partial<Beat>) {
  try {
    // Validate the update data
    const validatedData = beatSchema.partial().parse(data);

    const beat = await prisma.beat.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/admin");
    return { beat };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update beat" };
  }
}

// Helper function to check if a beat number exists
export async function checkBeatNumber(beatNumber: string) {
  try {
    const beat = await prisma.beat.findUnique({
      where: { beatNumber },
      select: { id: true },
    });
    return { exists: !!beat };
  } catch (error) {
    return { error: "Failed to check beat number" };
  }
}

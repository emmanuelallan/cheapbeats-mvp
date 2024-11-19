import { uploadFile } from "@/actions/upload";

type ProgressCallback = (key: string, progress: number) => void;

export async function uploadFileToR2(
  file: File,
  onProgress?: ProgressCallback
): Promise<string> {
  try {
    const isPrivate = file.name.endsWith(".wav") || file.name.endsWith(".zip");
    const bucket = isPrivate ? "private" : "public";

    // Reset progress
    onProgress?.(file.name, 0);

    // Create smooth progress simulation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      // Gradually increase progress, slowing down as it gets higher
      const increment = Math.max(0.5, (100 - currentProgress) / 20);
      currentProgress = Math.min(95, currentProgress + increment);
      onProgress?.(file.name, currentProgress);
    }, 100);

    try {
      // Upload file using server action
      const result = await uploadFile(file, bucket);

      if (result.error) {
        // Set progress to 100 but with error state
        onProgress?.(file.name, -1); // Using -1 to indicate error
        throw new Error(result.error);
      }

      // Set progress to 100% on success
      currentProgress = 100;
      onProgress?.(file.name, currentProgress);

      return result.url!;
    } finally {
      clearInterval(progressInterval);
    }
  } catch (error) {
    // Ensure progress shows error state
    onProgress?.(file.name, -1);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload file"
    );
  }
}

// Helper function to get file extension
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

// Helper function to validate file type
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const extension = getFileExtension(file.name).toLowerCase();
  return allowedTypes.includes(extension);
}

// Helper function to validate file size (in MB)
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

// Constants for file validation
export const FILE_VALIDATION = {
  COVER: {
    types: ["jpg", "jpeg", "png", "webp"],
    maxSize: 2, // 2MB
  },
  AUDIO: {
    types: ["mp3", "wav"],
    maxSize: 50, // 50MB
  },
  STEMS: {
    types: ["zip"],
    maxSize: 500, // 500MB
  },
  MIDI: {
    types: ["zip"],
    maxSize: 500, // 500MB
  },
} as const;

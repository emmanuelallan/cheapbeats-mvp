"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle, FileAudio } from "lucide-react";
import { Purchase } from "@prisma/client";
import { downloadFile } from "@/actions/downloads";
import { cn } from "@/lib/utils";

interface DownloadCardProps {
  purchase: Purchase & {
    beat: {
      title: string;
      wavUrl: string;
      stemsUrl?: string | null;
      midiUrl?: string | null;
    };
    addons: {
      type: string;
      downloadUrl: string;
    }[];
  };
}

export function DownloadCard({ purchase }: DownloadCardProps) {
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (url: string, filename: string) => {
    try {
      setDownloading(filename);
      await downloadFile(url, filename);
      setDownloadedFiles((prev) => [...prev, filename]);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(null);
    }
  };

  const formatExpiryDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Download Your Beat</CardTitle>
        <p className="text-sm text-muted-foreground">
          Link expires on {formatExpiryDate(purchase.expiresAt)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">{purchase.beat.title}</h3>
          <div className="space-y-3">
            {/* WAV Download */}
            <DownloadButton
              filename={`${purchase.beat.title} - WAV.wav`}
              url={purchase.beat.wavUrl}
              isDownloading={downloading === "wav"}
              isDownloaded={downloadedFiles.includes("wav")}
              onClick={() => handleDownload(purchase.beat.wavUrl, "wav")}
            />

            {/* Show Stems download if available */}
            {purchase.addons.some((addon) => addon.type === "STEMS") && (
              <DownloadButton
                filename={`${purchase.beat.title} - Stems.zip`}
                url={purchase.beat.stemsUrl!}
                isDownloading={downloading === "stems"}
                isDownloaded={downloadedFiles.includes("stems")}
                onClick={() => handleDownload(purchase.beat.stemsUrl!, "stems")}
              />
            )}

            {/* Show MIDI download if available */}
            {purchase.addons.some((addon) => addon.type === "MIDI") && (
              <DownloadButton
                filename={`${purchase.beat.title} - MIDI.zip`}
                url={purchase.beat.midiUrl!}
                isDownloading={downloading === "midi"}
                isDownloaded={downloadedFiles.includes("midi")}
                onClick={() => handleDownload(purchase.beat.midiUrl!, "midi")}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DownloadButtonProps {
  filename: string;
  url: string;
  isDownloading: boolean;
  isDownloaded: boolean;
  onClick: () => void;
}

function DownloadButton({
  filename,
  isDownloading,
  isDownloaded,
  onClick,
}: DownloadButtonProps) {
  return (
    <div className="flex items-center gap-4 justify-between p-3 bg-muted rounded-lg">
      <FileAudio className="h-8 w-8" />
      <div className="flex-1">
        <h3 className="font-semibold uppercase">
          {filename.split(".")[1]} File
        </h3>
        <p className="text-sm text-muted-foreground capitalize">
          High quality {filename.split(".")[1]} format
        </p>
      </div>
      <Button
        variant={isDownloaded ? "secondary" : "default"}
        size="sm"
        onClick={onClick}
        disabled={isDownloading}
        className={cn("min-w-[100px]", isDownloaded && "text-green-500")}
      >
        {isDownloading ? (
          "Downloading..."
        ) : isDownloaded ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Downloaded
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download <span className="uppercase">{filename.split(".")[1]}</span>
          </>
        )}
      </Button>
    </div>
  );
}

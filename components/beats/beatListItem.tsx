"use client";

import { useState } from "react";
import { usePlayerStore } from "@/providers/store-provider";
import { PublicBeat } from "@/types/index";
import Image from "next/image";
import { Play, Pause, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Beat } from "@prisma/client";
import { cn } from "@/lib/utils";
import LicenseModal from "../license/licenseModal";

export const BeatListItem = ({
  beat,
  index,
}: {
  beat: PublicBeat;
  index: number;
}) => {
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const { queue, currentTrack, isPlaying, setCurrentTrack, setIsPlaying } =
    usePlayerStore();

  const isCurrentBeat = queue[currentTrack]?.id === beat.id;

  const handlePlay = () => {
    if (isCurrentBeat) {
      setIsPlaying(!isPlaying);
    } else {
      const trackIndex = queue.findIndex((item) => item.id === beat.id);
      if (trackIndex !== -1) {
        setCurrentTrack(trackIndex);
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-4 p-4 hover:bg-accent/50 rounded-lg transition-colors",
          isCurrentBeat && "bg-accent/30"
        )}
      >
        <div className="flex items-center gap-4 flex-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10"
            onClick={handlePlay}
          >
            {isCurrentBeat && isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Image
            src={beat.coverImageUrl}
            alt={beat.title}
            width={48}
            height={48}
            className="rounded-md"
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{beat.title}</span>
              <span className="text-xs text-muted-foreground">
                #{beat.beatNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {beat.genres.split(",")[0]}
              </span>
              <span className="text-sm text-muted-foreground">
                {beat.bpm} BPM • {beat.key}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              onClick={() => setIsLicenseModalOpen(true)}
            >
              Buy Now ${beat.nonExclusivePrice}
            </Button>
          </div>
        </div>
      </div>

      <LicenseModal
        beat={beat}
        open={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
    </>
  );
};

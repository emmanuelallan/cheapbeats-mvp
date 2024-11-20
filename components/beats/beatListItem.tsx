"use client";

import { useState } from "react";
import { usePlayerStore } from "@/providers/store-provider";
import { PublicBeat } from "@/types/index";
import Image from "next/image";
import { Play, Pause, Share2, Tag, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LicenseModal from "../license/licenseModal";

export const BeatListItem = ({
  beat,
  index,
}: {
  beat: PublicBeat;
  index: number;
}) => {
  const [isHovering, setIsHovering] = useState(false);
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
          "group flex items-center justify-between py-3 pr-5 pl-4 hover:bg-accent/50 transition-colors cursor-pointer",
          isCurrentBeat && "bg-accent/30"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handlePlay}
      >
        <figure className="relative flex justify-start">
          <div
            className="flex relative justify-start items-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center justify-center relative w-8 h-8 mr-4">
              {isHovering || (isCurrentBeat && isPlaying) ? (
                <div className="absolute w-full h-full z-30">
                  <div className="relative flex justify-center items-center w-full z-10 h-full">
                    <Button
                      className="m-0 bg-white p-2.5 rounded-full flex cursor-pointer text-foreground hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay();
                      }}
                    >
                      {isCurrentBeat && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="block text-sm tracking-[.1px] font-sans font-medium absolute z-20 text-[#9F9F9F]">
                  {index + 1}
                </div>
              )}
            </div>
            <div className="h-12 w-12 rounded-md overflow-hidden">
              <Image
                src={beat.coverImageUrl}
                alt={beat.title}
                width={64}
                height={64}
                className="max-w-full flex border border-black/20"
              />
            </div>
          </div>
          <figcaption>
            <div className="grid list-grid">
              <div className="item-title">
                <div className="w-full flex items-center">
                  <h3 className="whitespace-nowrap truncate overflow-hidden text-base font-medium inline-block text-left">
                    {beat.title}
                  </h3>
                </div>
              </div>

              <div className="item-subtitle flex items-center overflow-hidden py-0.5">
                <span className="text-sm tracking-[.1px] font-normal text-[#707070] whitespace-nowrap">
                  {beat.key}
                </span>
              </div>

              <div className="extra-info flex items-center before:content-['•'] before:text-muted-foreground before:text-xs before:mx-1">
                <span className="whitespace-nowrap truncate overflow-hidden text-[#707070] text-sm tracking-[.1px] font-normal inline-block text-left">
                  {beat.bpm} BPM
                </span>
              </div>
            </div>
          </figcaption>
        </figure>

        <div className="flex justify-end gap-4">
          <div className="lg:flex items-center hidden">
            {beat.tags.map((tag, i) => (
              <div className="md:flex gap-x-1 hidden" key={i}>
                <div className="max-w-[200px] flex items-center">
                  <div className="max-w-[100px] mr-2 overflow-hidden">
                    <div className="w-full inline-block">
                      <span className="bg-[#F0F0F0] py-1.5 px-4 rounded-full border border-transparent">
                        <span className="whitespace-nowrap text-xs font-medium text-[#707070]">
                          #{tag}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full flex items-center justify-end">
            <Button
              variant="default"
              className="bg-[#006AFF] py-[7px] px-3 md:rounded-lg border-none rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsLicenseModalOpen(true);
              }}
            >
              <Tag size={12} className="text-white" />
              <span className="whitespace-nowrap text-xs font-sans font-medium text-white md:block hidden">
                ${beat.nonExclusivePrice.toFixed(2)}
              </span>
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 size={16} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical size={16} />
          </Button>
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

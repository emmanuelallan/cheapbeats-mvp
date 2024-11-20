"use client";

import { usePlayerStore } from "@/providers/store-provider";
import {
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  ChevronUp,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const Player = () => {
  const {
    queue,
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setIsPlaying,
    playNext,
    playPrevious,
    toggleMute,
    setVolume,
  } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentBeat = queue[currentTrack];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentBeat]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100;
      setProgress(isNaN(currentProgress) ? 0 : currentProgress);
    }
  };

  const handleProgressChange = (value: number) => {
    if (audioRef.current && !isNaN(value)) {
      const time = (value / 100) * (audioRef.current.duration || 0);
      audioRef.current.currentTime = time;
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  if (!currentBeat) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t transition-all duration-300 ease-in-out group",
        isExpanded ? "h-40 sm:h-28" : "h-20"
      )}
    >
      <div className="container mx-auto px-4 h-full flex flex-col justify-between py-2 pt-3 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 cursor-pointer">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={(e) => handleProgressChange(Number(e.target.value))}
          className="absolute top-0 left-0 right-0 w-full h-1 opacity-0 cursor-pointer group"
          aria-label="Seek"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full rounded-t-md rounded-b-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronUp
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
          <span className="sr-only">
            {isExpanded ? "Collapse player" : "Expand player"}
          </span>
        </Button>

        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={currentBeat.coverImageUrl}
                alt={currentBeat.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-sm truncate">
                {currentBeat.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                #{currentBeat.beatNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={playPrevious}>
              <SkipBack className="h-4 w-4" />
              <span className="sr-only">Previous track</span>
            </Button>
            <Button
              onClick={togglePlay}
              size="icon"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Next track</span>
            </Button>
          </div>

          <div className={cn("space-y-2", !isExpanded && "hidden sm:block")}>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                className="w-20"
                onValueChange={([value]) => {
                  setVolume(value / 100);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentBeat.previewMp3Url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
    </div>
  );
};

export default Player;

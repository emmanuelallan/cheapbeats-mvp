"use client";

import { usePlayerStore } from "@/providers/store-provider";
import {
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Play,
  Pause,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

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
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  if (!currentBeat) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-20 container mx-auto px-4 py-8">
      <div className="container mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <Image
              src={currentBeat.coverImageUrl}
              alt={currentBeat.title}
              fill
              className="object-cover rounded"
            />
          </div>
          <div>
            <h3 className="font-medium">{currentBeat.title}</h3>
            <p className="text-sm text-muted-foreground">
              #{currentBeat.beatNumber}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-lg">
          <div className="flex items-center gap-4">
            <button onClick={playPrevious}>
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Play className="h-5 w-5 text-primary-foreground" />
              )}
            </button>
            <button onClick={playNext}>
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <div className="w-full">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              className="w-full"
              onValueChange={([value]) => {
                if (audioRef.current) {
                  const time = (value / 100) * audioRef.current.duration;
                  audioRef.current.currentTime = time;
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            className="w-24"
            onValueChange={([value]) => {
              setVolume(value / 100);
            }}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentBeat.previewMp3Url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => playNext()}
      />
    </div>
  );
};

export default Player;

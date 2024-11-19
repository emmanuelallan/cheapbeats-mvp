import { createStore } from "zustand/vanilla";
import { PublicBeat } from "@/types/index";

export interface PlayerStore {
  queue: PublicBeat[];
  currentTrack: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  setQueue: (beats: PublicBeat[]) => void;
  setCurrentTrack: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearQueue: () => void;
  addToQueue: (beat: PublicBeat) => void;
  removeFromQueue: (index: number) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

export const createPlayerStore = () => {
  return createStore<PlayerStore>((set, get) => ({
    queue: [],
    currentTrack: 0,
    isPlaying: false,
    volume: 1,
    isMuted: false,
    setQueue: (beats) => set({ queue: beats }),
    setCurrentTrack: (index) => set({ currentTrack: index }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    playNext: () => {
      const { queue, currentTrack } = get();
      if (currentTrack < queue.length - 1) {
        set({ currentTrack: currentTrack + 1 });
      }
    },
    playPrevious: () => {
      const { currentTrack } = get();
      if (currentTrack > 0) {
        set({ currentTrack: currentTrack - 1 });
      }
    },
    clearQueue: () => set({ queue: [], currentTrack: 0, isPlaying: false }),
    addToQueue: (beat) => set((state) => ({ queue: [...state.queue, beat] })),
    removeFromQueue: (index) =>
      set((state) => ({
        queue: state.queue.filter((_, i) => i !== index),
        currentTrack:
          index < state.currentTrack
            ? state.currentTrack - 1
            : state.currentTrack,
      })),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    setVolume: (volume) => set({ volume }),
  }));
};

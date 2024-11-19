"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand/react";
import { createFilterStore, type FilterStore } from "@/store/filter";
import { createPlayerStore, type PlayerStore } from "@/store/player";
import { useShallow } from "zustand/shallow";

export type FilterStoreApi = ReturnType<typeof createFilterStore>;
export type PlayerStoreApi = ReturnType<typeof createPlayerStore>;

export const FilterStoreContext = createContext<FilterStoreApi | undefined>(
  undefined
);
export const PlayerStoreContext = createContext<PlayerStoreApi | undefined>(
  undefined
);

export interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const filterStoreRef = useRef<FilterStoreApi>();
  const playerStoreRef = useRef<PlayerStoreApi>();

  if (!filterStoreRef.current) {
    filterStoreRef.current = createFilterStore();
  }
  if (!playerStoreRef.current) {
    playerStoreRef.current = createPlayerStore();
  }

  return (
    <FilterStoreContext.Provider value={filterStoreRef.current}>
      <PlayerStoreContext.Provider value={playerStoreRef.current}>
        {children}
      </PlayerStoreContext.Provider>
    </FilterStoreContext.Provider>
  );
};

export const useFilterStore = <T = FilterStore,>(
  selector?: (store: FilterStore) => T
): T => {
  const filterStoreContext = useContext(FilterStoreContext);
  if (!filterStoreContext) {
    throw new Error(`useFilterStore must be used within StoreProvider`);
  }
  return useStore(
    filterStoreContext,
    selector ? selector : (state) => state as T
  );
};

export const usePlayerStore = <T = PlayerStore,>(
  selector?: (store: PlayerStore) => T
): T => {
  const playerStoreContext = useContext(PlayerStoreContext);
  if (!playerStoreContext) {
    throw new Error(`usePlayerStore must be used within StoreProvider`);
  }
  return useStore(
    playerStoreContext,
    selector ? useShallow(selector) : (state) => state as T
  );
};

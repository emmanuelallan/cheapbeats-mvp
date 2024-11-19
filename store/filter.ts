import { createStore } from "zustand/vanilla";
import debounce from "lodash/debounce";

export type FilterStore = FilterState & FilterActions;

export interface FilterState {
  search: string;
  genre: string | null;
  trackType: string | null;
  priceRange: [number, number];
  licenseType: "NON_EXCLUSIVE" | "EXCLUSIVE" | "BUYOUT" | null;
}

export interface FilterActions {
  setSearch: (search: string) => void;
  setGenre: (genre: string | null) => void;
  setTrackType: (type: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setLicenseType: (type: FilterState["licenseType"]) => void;
  resetFilters: () => void;
}

export const defaultInitState: FilterState = {
  search: "",
  genre: null,
  trackType: null,
  priceRange: [0, 1000],
  licenseType: null,
};

export const createFilterStore = (
  initState: FilterState = defaultInitState
) => {
  return createStore<FilterStore>((set) => ({
    ...initState,
    setSearch: debounce(
      (search: string) => set({ search: search.toUpperCase().trim() }),
      300
    ),
    setGenre: (genre) => set({ genre }),
    setTrackType: (type) => set({ trackType: type }),
    setPriceRange: (range) => set({ priceRange: range }),
    setLicenseType: (type) => set({ licenseType: type }),
    resetFilters: () => set(defaultInitState),
  }));
};

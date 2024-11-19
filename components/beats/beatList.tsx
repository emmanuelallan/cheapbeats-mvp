"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useMemo, useEffect } from "react";
import { useFilterStore, usePlayerStore } from "@/providers/store-provider";
import { getPublicBeats } from "@/actions/publicBeats";
import { BeatListItem } from "./beatListItem";
import { PublicBeat } from "@/types";

export const BeatsList = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const filters = useFilterStore();
  const setQueue = usePlayerStore((state) => state.setQueue);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "public-beats",
      filters.search,
      filters.genre,
      filters.trackType,
      filters.priceRange,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getPublicBeats({
        page: pageParam,
        search: filters.search,
        genre: filters.genre || "",
        trackType: filters.trackType || "",
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
      });

      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  const flatBeats = useMemo(() => {
    const beats = data?.pages.flatMap((page) => page.beats) ?? [];
    console.log("Flattened beats:", beats.length);
    return beats;
  }, [data]);

  useEffect(() => {
    if (flatBeats.length > 0) {
      setQueue(flatBeats as unknown as PublicBeat[]);
    }
  }, [flatBeats, setQueue]);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? flatBeats.length + 1 : flatBeats.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  useEffect(() => {
    const lastItem = rowVirtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;

    if (
      lastItem.index >= flatBeats.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    flatBeats.length,
    isFetchingNextPage,
    rowVirtualizer,
  ]);

  if (isLoading)
    return <div className="flex justify-center py-8">Loading beats...</div>;
  if (error)
    return (
      <div className="flex justify-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  if (!data?.pages[0]?.beats.length)
    return <div className="flex justify-center py-8">No beats found</div>;

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-200px)] overflow-auto"
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const beat = flatBeats[virtualRow.index];
          if (!beat) {
            return (
              <div
                key="loader"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                Loading more...
              </div>
            );
          }

          return (
            <div
              key={beat.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <BeatListItem beat={beat} index={virtualRow.index} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import debounce from "lodash/debounce";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/providers/store-provider";
import type { FilterState } from "@/store/filter";

interface Genre {
  name: string;
  image: string;
}

const genres: Genre[] = [
  { name: "Hip-Hop", image: "/genres/hip-hop.jpg" },
  { name: "EDM", image: "/genres/edm.jpg" },
  { name: "R&B - Soul", image: "/genres/rnb.jpg" },
  { name: "World\nDancehall", image: "/genres/dancehall.jpg" },
  { name: "Pop", image: "/genres/pop.jpg" },
  { name: "Indie Pop", image: "/genres/indie-pop.jpg" },
  { name: "Electric Pop", image: "/genres/electric-pop.jpg" },
  { name: "Pop-Rock", image: "/genres/pop-rock.jpg" },
];

const trackTypes = ["Beat", "Beat w/ Hook", "Top Line", "Vocal"];

const licenseTypes = [
  { id: "NON_EXCLUSIVE", label: "MP3 License", range: "4.99-19.99" },
  { id: "EXCLUSIVE", label: "WAV License", range: "99-599" },
  { id: "BUYOUT", label: "Full Rights", range: "599-4999" },
];

export default function FilterSearch() {
  const router = useRouter();
  const {
    search,
    genre,
    trackType,
    licenseType,
    setSearch,
    setGenre,
    setTrackType,
    setPriceRange,
    setLicenseType,
  } = useFilterStore();

  const [isGenreOpen, setIsGenreOpen] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  const handleGenreSelect = (genreName: string) => {
    setGenre(genre === genreName ? null : genreName);
  };

  const handleTrackTypeSelect = (type: string) => {
    setTrackType(trackType === type ? null : type);
  };

  const handlePriceSelect = (type: (typeof licenseTypes)[number]) => {
    const [min, max] = type.range.split("-").map((n) => parseFloat(n));
    setPriceRange([min, max]);
    setLicenseType(type.id as FilterState["licenseType"]);
  };

  return (
    <div className="w-full bg-secondary">
      <div className="container mx-auto">
        <ul className="flex items-center justify-center space-x-9 h-16">
          <li>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-2 font-semibold opacity-50 hover:opacity-100 transition-opacity px-0 py-6 hover:bg-transparent",
                isGenreOpen && "opacity-100"
              )}
              onClick={() => setIsGenreOpen(!isGenreOpen)}
            >
              Genre
              {isGenreOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 font-semibold opacity-50 hover:opacity-100 transition-opacity px-0 py-6 hover:bg-transparent"
                >
                  Track Type
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {trackTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => handleTrackTypeSelect(type)}
                    className={cn(trackType === type && "bg-accent")}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 font-semibold opacity-50 hover:opacity-100 transition-opacity px-0 py-6 hover:bg-transparent"
                >
                  License Type
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {licenseTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.id}
                    onClick={() => handlePriceSelect(type)}
                    className={cn(licenseType === type.id && "bg-accent")}
                  >
                    <div className="flex flex-col">
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        ${type.range}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li className="relative">
            <div className="flex items-center">
              <Search className="absolute right-0 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or beat #..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-transparent border-none outline-none focus-within:ring-0 placeholder:font-semibold placeholder:text-secondary-foreground opacity-70 pr-8 pl-4 w-[200px]"
              />
            </div>
          </li>
        </ul>
      </div>
      <AnimatePresence>
        {isGenreOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t overflow-hidden"
          >
            <div className="container mx-auto py-6 overflow-x-auto">
              <div className="flex space-x-4 min-w-max px-4">
                {genres.map((genreItem) => (
                  <button
                    key={genreItem.name}
                    onClick={() => handleGenreSelect(genreItem.name)}
                    className={cn(
                      "relative w-[200px] h-[200px] rounded-lg overflow-hidden group focus:outline-none",
                      genre === genreItem.name &&
                        "ring-2 ring-primary ring-offset-2"
                    )}
                  >
                    <Image
                      src={genreItem.image}
                      alt={genreItem.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 transition-opacity group-hover:bg-black/60" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-medium text-lg whitespace-pre-line text-center">
                      {genreItem.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

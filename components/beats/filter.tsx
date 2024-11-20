"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Search, Menu } from "lucide-react";
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
import Image from "next/image";

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
  { id: "NON_EXCLUSIVE", label: "Non Exclusive", range: "4.99-19.99" },
  { id: "EXCLUSIVE", label: "Exclusive", range: "99-599" },
  { id: "BUYOUT", label: "Buyout", range: "599-4999" },
];

export default function FilterSearch() {
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const debouncedSearch = useCallback(
    (value: string) => {
      setSearch(value);
    },
    [setSearch]
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

  const FilterItem = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{label}</h3>
      {children}
    </div>
  );

  return (
    <div className="w-full bg-secondary">
      <div className="container mx-auto">
        <div className="flex items-center lg:justify-center justify-between h-16 px-4 lg:px-0">
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <ul className="hidden lg:flex items-center justify-center space-x-9">
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
          </ul>
          <div className="relative flex-grow lg:flex-grow-0">
            <div className="flex items-center">
              <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or beat #..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full lg:w-[200px] bg-transparent border-none outline-none focus-within:ring-0 placeholder:font-semibold placeholder:text-secondary-foreground opacity-70 pr-8 pl-4"
              />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t overflow-hidden"
          >
            <div className="container mx-auto py-6 px-4">
              <FilterItem label="Genre">
                <div className="grid grid-cols-2 gap-2">
                  {genres.map((genreItem) => (
                    <button
                      key={genreItem.name}
                      onClick={() => handleGenreSelect(genreItem.name)}
                      className={cn(
                        "p-2 text-sm rounded-md",
                        genre === genreItem.name
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary-foreground/10"
                      )}
                    >
                      {genreItem.name}
                    </button>
                  ))}
                </div>
              </FilterItem>
              <FilterItem label="Track Type">
                <div className="grid grid-cols-2 gap-2">
                  {trackTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTrackTypeSelect(type)}
                      className={cn(
                        "p-2 text-sm rounded-md",
                        trackType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary-foreground/10"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </FilterItem>
              <FilterItem label="License Type">
                <div className="grid grid-cols-1 gap-2">
                  {licenseTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handlePriceSelect(type)}
                      className={cn(
                        "p-2 text-sm rounded-md text-left",
                        licenseType === type.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary-foreground/10"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span>{type.label}</span>
                        <span className="text-xs">${type.range}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </FilterItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
                      "relative w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] rounded-lg overflow-hidden group focus:outline-none",
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

"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateBeat } from "@/actions/beats";
import { GENRES, KEYS, TRACK_TYPES } from "@/lib/constants";
import { Beat } from "@prisma/client";

const editBeatSchema = z.object({
  title: z.string(),
  bpm: z.number(),
  key: z.string(),
  genres: z.string(),
  trackType: z.string(),
  tags: z.array(z.string()),
  duration: z.number(),
  isActive: z.boolean(),
  nonExclusivePrice: z
    .number()
    .min(4.99, "Non-exclusive price must be at least $4.99")
    .max(19.99, "Non-exclusive price cannot exceed $19.99"),
  exclusivePrice: z
    .number()
    .min(99, "Exclusive price must be at least $99")
    .max(599, "Exclusive price cannot exceed $599"),
  buyoutPrice: z
    .number()
    .min(599, "Buyout price must be at least $599")
    .max(4999, "Buyout price cannot exceed $4999"),
});

type EditBeatFormProps = {
  beat: Beat;
  onSuccess: (beat: Beat) => void;
};

export function EditBeatForm({ beat, onSuccess }: EditBeatFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(editBeatSchema),
    defaultValues: {
      title: beat.title,
      bpm: beat.bpm,
      key: beat.key,
      genres: beat.genres,
      trackType: beat.trackType,
      tags: beat.tags,
      duration: beat.duration,
      isActive: beat.isActive,
      nonExclusivePrice: beat.nonExclusivePrice,
      exclusivePrice: beat.exclusivePrice,
      buyoutPrice: beat.buyoutPrice,
    },
  });

  const onSubmit = async (data: z.infer<typeof editBeatSchema>) => {
    setIsLoading(true);
    try {
      const result = await updateBeat(beat.id, data);
      if (result.beat) {
        onSuccess(result.beat);
      }
    } catch (error) {
      console.error("Failed to update beat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bpm">BPM</Label>
          <Input
            id="bpm"
            type="number"
            {...form.register("bpm", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label>Key</Label>
          <Controller
            name="key"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Genre</Label>
          <Controller
            name="genres"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Track Type</Label>
          <Controller
            name="trackType"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRACK_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pricing</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nonExclusivePrice">Non-Exclusive Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                $
              </span>
              <Input
                id="nonExclusivePrice"
                type="number"
                step="0.01"
                min="4.99"
                max="19.99"
                className="pl-7"
                {...form.register("nonExclusivePrice", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exclusivePrice">Exclusive Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                $
              </span>
              <Input
                id="exclusivePrice"
                type="number"
                step="1"
                min="99"
                max="599"
                className="pl-7"
                {...form.register("exclusivePrice", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyoutPrice">Buyout Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                $
              </span>
              <Input
                id="buyoutPrice"
                type="number"
                step="1"
                min="599"
                max="4999"
                className="pl-7"
                {...form.register("buyoutPrice", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Updating..." : "Update Beat"}
      </Button>
    </form>
  );
}

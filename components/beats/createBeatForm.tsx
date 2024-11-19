"use client";

import { useState, useCallback } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createBeat } from "@/actions/beats";
import { uploadFileToR2 } from "@/lib/upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { GENRES, KEYS, TRACK_TYPES } from "@/lib/constants";
import { ADDON_PRICES } from "@/types";

const createBeatSchema = z.object({
  title: z.string().min(1, "Title is required"),
  bpm: z
    .number()
    .int()
    .min(1, "BPM must be at least 1")
    .max(300, "BPM cannot exceed 300"),
  key: z.string().min(1, "Key is required"),
  genres: z.string().min(1, "Genre is required"),
  trackType: z.string().min(1, "Track type is required"),
  tags: z.string().min(1, "At least one tag is required"),
  duration: z.number().positive("Duration must be positive"),
  cover: z.custom<File>((v) => v instanceof File, "Cover image is required"),
  preview: z.custom<File>(
    (v) => v instanceof File,
    "Preview audio is required"
  ),
  wav: z.custom<File>((v) => v instanceof File, "WAV file is required"),
  stems: z
    .custom<File>(
      (v) => v instanceof File || v === undefined,
      "Stems file is optional"
    )
    .optional(),
  midi: z
    .custom<File>(
      (v) => v instanceof File || v === undefined,
      "MIDI file is optional"
    )
    .optional(),
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
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof createBeatSchema>;

type FileUploadProps = {
  name: keyof FormData;
  label: string;
  accept: Record<string, string[]>;
  required: boolean;
  onDrop: (acceptedFiles: File[]) => void;
  file: File | null;
  error?: string;
  progress: number;
  helperText?: string;
};

const FileUpload = ({
  name,
  label,
  accept,
  required,
  onDrop,
  file,
  error,
  progress,
  helperText,
}: FileUploadProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && " *"}
      </Label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-4 ${
          isDragActive ? "border-primary" : "border-border"
        } ${error ? "border-red-500" : ""}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>
            {isDragActive
              ? "Drop the file here"
              : "Drag 'n' drop a file here, or click to select"}
          </p>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {progress > 0 && (
        <Progress
          value={progress}
          className={`w-full h-1 ${
            progress === 100
              ? "!bg-green-500"
              : progress === -1
              ? "!bg-red-500"
              : ""
          }`}
        />
      )}
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

type SelectFieldProps = {
  name: keyof Pick<FormData, "key" | "genres" | "trackType">;
  label: string;
  options: readonly string[];
  control: ReturnType<typeof useForm<FormData>>["control"];
  error?: string;
};

const SelectField = ({
  name,
  label,
  options,
  control,
  error,
}: SelectFieldProps) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} is required` }}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export function CreateBeatForm({ onSuccess }: { onSuccess: () => void }) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [files, setFiles] = useState<Record<string, File | null>>({
    cover: null,
    preview: null,
    wav: null,
    stems: null,
    midi: null,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createBeatSchema),
    mode: "onBlur",
  });

  const createBeatMutation = useMutation({
    mutationFn: createBeat,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["beats"],
        exact: true,
      });
      toast({ title: "Success", description: "Beat created successfully" });
      onSuccess();
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create beat",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback(
    (fieldName: keyof FormData) => async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFiles((prev) => ({ ...prev, [fieldName]: file }));
        setValue(fieldName as keyof FormData, file);

        if (fieldName === "preview") {
          try {
            const audio = new Audio();
            const objectUrl = URL.createObjectURL(file);
            audio.src = objectUrl;

            // Add a promise to handle the duration calculation
            const getDuration = new Promise<number>((resolve) => {
              audio.addEventListener("loadedmetadata", () => {
                resolve(audio.duration);
              });
            });

            const duration = await getDuration;
            setValue("duration", duration);
            console.log("Duration set to:", duration);

            // Clean up object URL
            URL.revokeObjectURL(objectUrl);
          } catch (error) {
            console.error("Error getting audio duration:", error);
            toast({
              title: "Error",
              description: "Failed to get audio duration",
              variant: "destructive",
            });
          }
        }
      }
    },
    [setValue, toast]
  );

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!files.cover || !files.preview || !files.wav) {
      toast({
        title: "Error",
        description: "Please upload all required files",
        variant: "destructive",
      });
      return;
    }

    const uploadFile = async (file: File | null, key: string) => {
      if (!file) return null;
      try {
        const url = await uploadFileToR2(file, (_, progress) => {
          setUploadProgress((prev) => ({ ...prev, [key]: progress }));
        });
        return url;
      } catch (error) {
        console.error(`Error uploading ${key}:`, error);
        throw error;
      }
    };

    try {
      const [coverImageUrl, previewMp3Url, wavUrl, stemsUrl, midiUrl] =
        await Promise.all([
          uploadFile(files.cover, "cover"),
          uploadFile(files.preview, "preview"),
          uploadFile(files.wav, "wav"),
          uploadFile(files.stems, "stems"),
          uploadFile(files.midi, "midi"),
        ]);

      if (!coverImageUrl || !previewMp3Url || !wavUrl) {
        throw new Error("Failed to upload required files");
      }

      // Calculate final prices including addons
      const finalNonExclusivePrice = data.nonExclusivePrice;
      const finalExclusivePrice =
        data.exclusivePrice +
        (files.stems ? ADDON_PRICES.STEMS : 0) +
        (files.midi ? ADDON_PRICES.MIDI : 0);
      const finalBuyoutPrice =
        data.buyoutPrice +
        (files.stems ? ADDON_PRICES.STEMS : 0) +
        (files.midi ? ADDON_PRICES.MIDI : 0);

      // Create beat with proper data structure
      createBeatMutation.mutate({
        ...data,
        coverImageUrl,
        previewMp3Url,
        wavUrl,
        stemsUrl: stemsUrl ?? undefined,
        midiUrl: midiUrl ?? undefined,
        nonExclusivePrice: finalNonExclusivePrice,
        exclusivePrice: finalExclusivePrice,
        buyoutPrice: finalBuyoutPrice,
        tags: data.tags.split(",").map((tag) => tag.trim()),
        isActive: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        console.log("Form submission started");
        return handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} placeholder="Beat title" />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bpm">BPM</Label>
          <Input
            id="bpm"
            type="number"
            {...register("bpm", { valueAsNumber: true })}
            min={1}
            max={300}
          />
          {errors.bpm && (
            <p className="text-sm text-red-500">{errors.bpm.message}</p>
          )}
        </div>

        <SelectField
          name="key"
          label="Key"
          options={KEYS}
          control={control}
          error={errors.key?.message}
        />
        <SelectField
          name="genres"
          label="Genre"
          options={GENRES}
          control={control}
          error={errors.genres?.message}
        />
        <SelectField
          name="trackType"
          label="Track Type"
          options={TRACK_TYPES}
          control={control}
          error={errors.trackType?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          {...register("tags")}
          placeholder="e.g., dark, melodic, aggressive"
        />
        {errors.tags && (
          <p className="text-sm text-red-500">{errors.tags.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pricing</h3>
        <div className="grid grid-cols-3 gap-4">
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
                {...register("nonExclusivePrice", {
                  valueAsNumber: true,
                  min: 4.99,
                  max: 19.99,
                })}
              />
            </div>
            {errors.nonExclusivePrice && (
              <p className="text-sm text-red-500">
                {errors.nonExclusivePrice.message}
              </p>
            )}
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
                {...register("exclusivePrice", {
                  valueAsNumber: true,
                  min: 99,
                  max: 599,
                })}
              />
            </div>
            {errors.exclusivePrice && (
              <p className="text-sm text-red-500">
                {errors.exclusivePrice.message}
              </p>
            )}
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
                {...register("buyoutPrice", {
                  valueAsNumber: true,
                  min: 599,
                  max: 4999,
                })}
              />
            </div>
            {errors.buyoutPrice && (
              <p className="text-sm text-red-500">
                {errors.buyoutPrice.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Files</h3>
        <div className="grid grid-cols-2 gap-4">
          <FileUpload
            name="cover"
            label="Cover Image"
            accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
            required={true}
            onDrop={onDrop("cover")}
            file={files.cover}
            error={errors.cover?.message}
            progress={uploadProgress.cover ?? 0}
            helperText="$200 add-on"
          />
          <FileUpload
            name="preview"
            label="Preview MP3"
            accept={{ "audio/mpeg": [".mp3"] }}
            required={true}
            onDrop={onDrop("preview")}
            file={files.preview}
            error={errors.preview?.message}
            progress={uploadProgress.preview ?? 0}
            helperText="$100 add-on"
          />
          <FileUpload
            name="wav"
            label="WAV File"
            accept={{ "audio/wav": [".wav"] }}
            required={true}
            onDrop={onDrop("wav")}
            file={files.wav}
            error={errors.wav?.message}
            progress={uploadProgress.wav ?? 0}
            helperText="$200 add-on"
          />
          <FileUpload
            name="stems"
            label="Stems (ZIP) - Optional"
            accept={{ "application/zip": [".zip"] }}
            required={false}
            onDrop={onDrop("stems")}
            file={files.stems}
            error={errors.stems?.message}
            progress={uploadProgress.stems ?? 0}
            helperText="$200 add-on"
          />
          <FileUpload
            name="midi"
            label="MIDI (ZIP) - Optional"
            accept={{ "application/zip": [".zip"] }}
            required={false}
            onDrop={onDrop("midi")}
            file={files.midi}
            error={errors.midi?.message}
            progress={uploadProgress.midi ?? 0}
            helperText="$100 add-on"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createBeatMutation.isPending}
      >
        {createBeatMutation.isPending ? "Uploading..." : "Upload Beat"}
      </Button>

      {Object.keys(errors).length > 0 && (
        <div className="text-sm text-red-500">
          <p>Form has the following errors:</p>
          <ul>
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>
                {key}: {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

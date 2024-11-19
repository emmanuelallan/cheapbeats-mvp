import type { JWTPayload } from "jose";

export interface Beat {
  id: string;
  title: string;
  beatNumber: string;
  bpm: number;
  key: string;
  genres: string;
  trackType: string;
  tags: string[];
  duration: number;
  coverImageUrl: string;
  previewMp3Url: string;
  wavUrl: string;
  stemsUrl?: string;
  midiUrl?: string;
  nonExclusivePrice: number;
  exclusivePrice: number;
  buyoutPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  purchases?: Purchase[];
}

export interface BeatAddon {
  type: "STEMS" | "MIDI";
  price: number;
  downloadUrl: string;
}

export const ADDON_PRICES = {
  STEMS: 200,
  MIDI: 100,
} as const;

export interface License {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  rights: string[];
  allowsStems: boolean;
  isActive: boolean;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  isActive: boolean;
}

export interface Purchase {
  id: string;
  beatId: string;
  licenseType: "NON_EXCLUSIVE" | "EXCLUSIVE" | "BUYOUT";
  customerEmail: string;
  downloadToken: string;
  expiresAt: Date;
  purchasedAt: Date;
  amount: number;
  transactionId?: string;
  isDownloaded: boolean;
  addons?: PurchaseAddon[];
}

// Create a new types file
export interface PublicBeat
  extends Pick<
    Beat,
    | "id"
    | "title"
    | "beatNumber"
    | "coverImageUrl"
    | "previewMp3Url"
    | "bpm"
    | "key"
    | "genres"
    | "tags"
    | "trackType"
    | "duration"
    | "createdAt"
    | "nonExclusivePrice"
    | "exclusivePrice"
    | "buyoutPrice"
  > {
  beatAddons: {
    type: "STEMS" | "MIDI";
    price: number;
  }[];
}

export interface PurchaseAddon {
  id: string;
  purchaseId: string;
  type: "STEMS" | "MIDI";
  price: number;
  downloadUrl: string;
}

export interface OtpVerification {
  id: string;
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
  verified: boolean;
}

export interface OtpResponse {
  success?: boolean;
  error?: string;
}

export interface SessionPayload extends JWTPayload {
  email: string;
  expiresAt: string;
}

export type ServerActionResponse<T> = Promise<{
  success?: T;
  error?: string;
}>;

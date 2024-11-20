"use client";

import { useQuery } from "@tanstack/react-query";
import { getLicenses } from "@/actions/licenses";
import { getAddons } from "@/actions/addons";
import { createCheckout } from "@/actions/checkout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { PublicBeat } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface LicenseModalProps {
  beat: PublicBeat;
  open: boolean;
  onClose: () => void;
}

export default function LicenseModal({
  beat,
  open,
  onClose,
}: LicenseModalProps) {
  const { data: licenses = [] } = useQuery({
    queryKey: ["licenses"],
    queryFn: getLicenses,
  });

  const { data: addons = [] } = useQuery({
    queryKey: ["addons"],
    queryFn: getAddons,
  });

  const [selectedLicense, setSelectedLicense] = useState<string>(
    licenses[0]?.id
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const handleCheckout = async () => {
    try {
      const result = await createCheckout({
        beatId: beat.id,
        licenseId: selectedLicense,
        addonIds: selectedAddons,
      });

      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      // TODO: Add error handling UI here
    }
  };

  const totalPrice = () => {
    const license = licenses.find((l) => l.id === selectedLicense);
    const addonPrices = addons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, addon) => sum + addon.price, 0);
    return (license?.basePrice || 0) + addonPrices;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 max-h-[90vh] overflow-auto">
        <DialogHeader className="sticky top-0 z-10 bg-background p-6 pb-0 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl capitalize">
                {beat.title}
              </DialogTitle>
              <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground items-center">
                <Button variant="link" className="hover:underline p-0" asChild>
                  <Link
                    href="/licenses"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View Licenses
                  </Link>
                </Button>
                <span className="hidden sm:inline">/</span>
                <Button variant="link" className="hover:underline p-0" asChild>
                  <Link href="/faq" target="_blank" rel="noreferrer noopener">
                    View FAQ
                  </Link>
                </Button>
              </div>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <div className="flex items-center justify-end mt-4">
            <div className="text-sm">
              CHECKOUT: <span className="font-semibold">${totalPrice()}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {licenses.map((license) => {
              const isSelected = selectedLicense === license.id;

              return (
                <button
                  key={license.id}
                  onClick={() => setSelectedLicense(license.id)}
                  className={cn(
                    "relative rounded-2xl border p-6 text-center transition-all hover:border-[#40F4C7]",
                    isSelected
                      ? "bg-[#f2fffe] border-[#40F4C7]"
                      : "bg-white border-border"
                  )}
                >
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium uppercase">
                        {license.name}
                      </div>
                      <div className="flex items-start justify-center">
                        <span className="text-sm">$</span>
                        <span className="text-4xl font-bold">
                          {license.basePrice}
                        </span>
                      </div>
                      <div className="text-sm uppercase text-muted-foreground">
                        WAV
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {license.rights.map((right, i) => (
                        <div key={i} className="text-center">
                          {right}
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/licenses/#${license.name.toLowerCase()}`}
                      className="text-sm underline cursor-pointer"
                    >
                      View license
                    </Link>

                    <div className="absolute bottom-6 right-6 h-6 w-6 rounded-sm border">
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-sm bg-black" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Addons</h3>
            <div className="space-y-4">
              {addons.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);

                return (
                  <button
                    key={addon.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAddons(
                          selectedAddons.filter((id) => id !== addon.id)
                        );
                      } else {
                        setSelectedAddons([...selectedAddons, addon.id]);
                      }
                    }}
                    className={cn(
                      "w-full text-left rounded-lg border p-4 transition-all hover:border-primary",
                      isSelected ? "border-primary" : "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-5 w-5 rounded-sm border mt-0.5 flex-shrink-0">
                          {isSelected && (
                            <div className="flex h-full items-center justify-center">
                              <div className="h-3 w-3 rounded-sm bg-black" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium uppercase">
                            {addon.name}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {addon.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium ml-2">
                        ${addon.price}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 sticky bottom-0 bg-background py-4 shadow-md">
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout (${totalPrice()})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

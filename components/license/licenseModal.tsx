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
} from "@/components/ui/dialog";
import { PublicBeat } from "@/types";

interface LicenseModalProps {
  beat: PublicBeat;
  open: boolean;
  onClose: () => void;
}

export default function LicenseModal({
  beat,
  open,
  onClose,
}: Omit<LicenseModalProps, "licenses" | "addons">) {
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
      console.log("Selected license:", selectedLicense);
      console.log("Selected beat:", beat.id);
      console.log("Selected addons:", selectedAddons);
      const result = await createCheckout({
        beatId: beat.id,
        licenseId: selectedLicense,
        addonIds: selectedAddons,
      });

      console.log("Checkout result:", result);

      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      // Add error handling UI here
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
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl capitalize">
                {beat.title}
              </DialogTitle>
              <div className="flex gap-2 mt-1 text-sm text-muted-foreground items-center">
                <Button variant="link" className="hover:underline p-0" asChild>
                  <a
                    href={`/licenses`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View Licenses
                  </a>
                </Button>
                <span>/</span>
                <Button variant="link" className="hover:underline p-0" asChild>
                  <a href={`/faq`} target="_blank" rel="noreferrer noopener">
                    View FAQ
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                CHECKOUT: <span className="font-semibold">${totalPrice()}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {licenses.map((license) => {
              const isSelected = selectedLicense === license.id;

              return (
                <button
                  key={license.id}
                  onClick={() => setSelectedLicense(license.id)}
                  className={`relative rounded-2xl border p-6 text-center transition-all hover:border-[#40F4C7]  ${
                    isSelected
                      ? "bg-[#f2fffe] border-[#40F4C7]"
                      : "bg-white border-border"
                  }`}
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

                    <span className="text-sm underline cursor-pointer">
                      View license
                    </span>

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
                    className={`w-full text-left rounded-lg border p-4 transition-all hover:border-primary ${
                      isSelected ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-5 w-5 rounded-sm border mt-0.5">
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
                      <div className="text-sm font-medium">${addon.price}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout (${totalPrice()})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

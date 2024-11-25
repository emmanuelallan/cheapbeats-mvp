"use client";

import { useQuery } from "@tanstack/react-query";
import { getLicenses } from "@/actions/licenses";
import { getAddons } from "@/actions/addons";
import { useState, useEffect } from "react";
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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const { data: addons = [] } = useQuery({
    queryKey: ["addons"],
    queryFn: getAddons,
  });

  const [selectedLicense, setSelectedLicense] = useState<string>();
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (licenses.length > 0 && !selectedLicense) {
      setSelectedLicense(licenses[0].id);
    }
  }, [licenses, selectedLicense]);

  useEffect(() => {
    console.log("Selected License:", selectedLicense);
    console.log("Available Licenses:", licenses);
  }, [selectedLicense, licenses]);

  const totalPrice = () => {
    const license = licenses.find((l) => l.id === selectedLicense);
    const addonPrices = addons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, addon) => sum + addon.price, 0);
    return (license?.basePrice || 0) + addonPrices;
  };

  const canCreateOrder = () => {
    return selectedLicense && totalPrice() > 0;
  };

  const createOrder = async () => {
    try {
      console.log("Creating order with:", {
        beatId: beat.id,
        licenseId: selectedLicense,
        addonIds: selectedAddons,
        amount: totalPrice(),
      });

      const response = await fetch("/api/create-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          beatId: beat.id,
          licenseId: selectedLicense,
          addonIds: selectedAddons,
          amount: totalPrice(),
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to create PayPal order");
      }

      const orderData = await response.json();
      console.log("Order data:", orderData);

      if (orderData.id) {
        return orderData.id;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Failed to create order. Please try again."
      );
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const response = await fetch("/api/capture-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to capture PayPal order");
      }

      const orderData = await response.json();
      if (orderData.success) {
        window.location.href = orderData.downloadPageUrl;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Failed to process payment. Please try again."
      );
    }
  };

  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}
    >
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 gap-0 max-h-[90vh] overflow-auto">
          <DialogHeader className="sticky top-0 z-10 bg-background p-6 pb-0 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl capitalize">
                  {beat.title}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground items-center">
                  <Button
                    variant="link"
                    className="hover:underline p-0"
                    asChild
                  >
                    <Link
                      href="/licenses"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      View Licenses
                    </Link>
                  </Button>
                  <span className="hidden sm:inline">/</span>
                  <Button
                    variant="link"
                    className="hover:underline p-0"
                    asChild
                  >
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
              {paymentError && (
                <div className="text-red-500 mb-4 text-center">
                  {paymentError}
                </div>
              )}
              {!canCreateOrder() && (
                <div className="text-amber-500 mb-4 text-center">
                  Please select a license to continue
                </div>
              )}
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                style={{ layout: "horizontal" }}
                disabled={!canCreateOrder()}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PayPalScriptProvider>
  );
}

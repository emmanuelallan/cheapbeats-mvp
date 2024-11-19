"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const requestOtp = async () => {
    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowOtpInput(true);
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code",
        });
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showOtpInput ? (
            <>
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={requestOtp} className="w-full">
                Request OTP
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              <Button onClick={verifyOtp} className="w-full">
                Verify OTP
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

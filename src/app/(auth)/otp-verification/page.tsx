"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/new-password");
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[436px]">
        {/* Back to Login */}
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-[#666d80] hover:text-[#0d0d12] mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-[16px]">Geri</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#e1eee3] border border-[#09724a] flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-[#09724a]" />
          </div>
          <h1 className="text-[24px] font-bold text-[#0d0d12] leading-[31.2px] tracking-[-0.48px] mb-2">
            OTP Doğrulama
          </h1>
          <p className="text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px]">
            E-posta adresinize gönderilen 6 haneli kodu girin.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-[52px] h-[52px] rounded-xl border border-[#e5e7eb] bg-white text-center text-[24px] font-semibold text-[#0d0d12] focus:outline-none focus:ring-2 focus:ring-[#09724a] focus:border-transparent transition-all"
              />
            ))}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="default"
            className="w-full"
            disabled={!isComplete || isLoading}
          >
            {isLoading ? "Doğrulanıyor..." : "Kodu Doğrula"}
          </Button>

          {/* Resend */}
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-[14px] text-[#666d80]">
                Tekrar gönder:{" "}
                <span className="font-semibold text-[#09724a]">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[14px] font-semibold text-[#09724a] hover:underline"
              >
                Kodu Tekrar Gönder
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

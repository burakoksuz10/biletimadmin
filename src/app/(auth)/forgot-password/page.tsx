"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth.schema";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Mock API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to send reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[436px]">
        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[#666d80] hover:text-[#0d0d12] mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-[16px]">Girişe Dön</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#e1eee3] border border-[#09724a] flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-[#09724a]" />
          </div>
          <h1 className="text-[24px] font-bold text-[#0d0d12] leading-[31.2px] tracking-[-0.48px] mb-2">
            Şifremi Unuttum?
          </h1>
          <p className="text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px]">
            E-posta adresinizi girin, şifrenizi sıfırlamanız için size bir link gönderelim.
          </p>
        </div>

        {/* Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] tracking-[0.28px] mb-2">
                E-posta Adresi
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="E-posta adresinizi girin"
                error={!!errors.email}
              />
              {errors.email && (
                <p className="text-[14px] text-[#df1c41] mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="default"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#effefa] flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#09724a]" />
            </div>
            <h2 className="text-[20px] font-semibold text-[#0d0d12] mb-2">
              E-postanızı Kontrol Edin
            </h2>
            <p className="text-[16px] text-[#666d80] leading-[24px] mb-6">
              Şifre sıfırlama linkini e-posta adresinize gönderdik.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              size="medium"
              className="w-full"
            >
              E-postayı Tekrar Gönder
            </Button>
          </div>
        )}

        {/* Back to Login */}
        <p className="text-center text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px] mt-6">
          Şifrenizi mi hatırladınız?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#09724a]"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

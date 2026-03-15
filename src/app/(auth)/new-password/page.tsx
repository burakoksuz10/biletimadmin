"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth.schema";

export default function NewPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "mock-token", // In real app, this comes from URL
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Password reset failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-[436px] text-center">
          <div className="w-20 h-20 rounded-full bg-[#effefa] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#09724a]" />
          </div>
          <h1 className="text-[24px] font-bold text-[#0d0d12] leading-[31.2px] tracking-[-0.48px] mb-2">
            Şifre Sıfırlama Başarılı
          </h1>
          <p className="text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px] mb-6">
            Şifreniz başarıyla sıfırlandı. Artık yeni şifrenizle giriş yapabilirsiniz.
          </p>
          <Link href="/login">
            <Button variant="primary" size="default" className="w-full">
              Giriş Sayfasına Git
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[436px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#e1eee3] border border-[#09724a] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-[#09724a]" />
          </div>
          <h1 className="text-[24px] font-bold text-[#0d0d12] leading-[31.2px] tracking-[-0.48px] mb-2">
            Yeni Şifre Oluştur
          </h1>
          <p className="text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px]">
            Aşağıya yeni şifrenizi girin.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Password Field */}
          <div>
            <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] tracking-[0.28px] mb-2">
              Yeni Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Yeni şifrenizi girin"
                className="pl-10 pr-12"
                error={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#818898] hover:text-[#0d0d12]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[14px] text-[#df1c41] mt-1">{errors.password.message}</p>
            )}

            {/* Password Requirements */}
            {password && (
              <div className="mt-3 space-y-2">
                <p className="text-[12px] text-[#666d80]">Şifre şunları içermelidir:</p>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-[12px] ${hasMinLength ? "text-[#09724a]" : "text-[#666d80]"}`}>
                    <div className={`w-3 h-3 rounded-full ${hasMinLength ? "bg-[#09724a]" : "bg-[#e5e7eb]"}`} />
                    En az 8 karakter
                  </div>
                  <div className={`flex items-center gap-2 text-[12px] ${hasUpperCase ? "text-[#09724a]" : "text-[#666d80]"}`}>
                    <div className={`w-3 h-3 rounded-full ${hasUpperCase ? "bg-[#09724a]" : "bg-[#e5e7eb]"}`} />
                    Bir büyük harf
                  </div>
                  <div className={`flex items-center gap-2 text-[12px] ${hasLowerCase ? "text-[#09724a]" : "text-[#666d80]"}`}>
                    <div className={`w-3 h-3 rounded-full ${hasLowerCase ? "bg-[#09724a]" : "bg-[#e5e7eb]"}`} />
                    Bir küçük harf
                  </div>
                  <div className={`flex items-center gap-2 text-[12px] ${hasNumber ? "text-[#09724a]" : "text-[#666d80]"}`}>
                    <div className={`w-3 h-3 rounded-full ${hasNumber ? "bg-[#09724a]" : "bg-[#e5e7eb]"}`} />
                    Bir rakam
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] tracking-[0.28px] mb-2">
              Yeni Şifreyi Onayla
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Yeni şifrenizi onaylayın"
                className="pl-10 pr-12"
                error={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#818898] hover:text-[#0d0d12]"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[14px] text-[#df1c41] mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="default"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
          </Button>

          {/* Back to Login */}
          <p className="text-center text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px]">
            Şifrenizi mi hatırladınız?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#09724a]"
            >
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

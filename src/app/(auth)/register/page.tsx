"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth.schema";
import { useAuth } from "@/contexts/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[1192px] h-[670px] rounded-full bg-[#09724a] opacity-100 -translate-x-1/2 -translate-y-1/2 -left-[525px] -top-[265px]" />
      <div className="absolute bottom-0 right-0 w-[778px] h-[604px] rounded-full bg-[#09724a] opacity-80 translate-x-1/2 translate-y-1/2 right-[1040px] top-[274px]" />
      <div className="absolute bottom-0 left-0 w-[824px] h-[325px] rounded-full bg-[#097247a] opacity-80 -translate-x-1/2 -translate-y-1/2 -left-[225px] top-[972px]" />

      {/* Main Content */}
      <div className="relative z-10 w-full h-screen flex">
        {/* Left Panel - Register Form */}
        <div className="w-[436px] h-full flex flex-col justify-center px-[82px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 w-[155px] h-12">
            <div className="w-10 h-10 rounded-[9.85px] bg-[#09724a] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#e1eee3] border border-[#09724a]" />
            </div>
            <span className="text-[24.6px] font-bold text-[#0d0d12] leading-[33.23px]">
              Biletim
            </span>
          </Link>

          {/* Register Form */}
          <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[24px] font-bold text-[#0d0d12] leading-[31.2px] tracking-[-0.48px] mb-2">
                Hesap Oluştur
              </h1>
              <p className="text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px]">
                Biletim'e katılın ve etkinliklerinizi yönetmeye bugün başlayın.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] tracking-[0.28px] mb-2">
                  Ad Soyad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
                  <Input
                    {...register("name")}
                    type="text"
                    placeholder="Adınızı ve soyadınızı girin"
                    className="pl-10"
                    error={!!errors.name}
                  />
                </div>
                {errors.name && (
                  <p className="text-[14px] text-[#df1c41] mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] tracking-[0.28px] mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="E-posta adresinizi girin"
                    className="pl-10"
                    error={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="text-[14px] text-[#df1c41] mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] tracking-[0.28px] mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Bir şifre oluşturun"
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
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] tracking-[0.28px] mb-2">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Şifrenizi tekrar girin"
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

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-1" />
                <label
                  htmlFor="terms"
                  className="text-[14px] text-[#666d80] leading-[21px] cursor-pointer"
                >
                  {" "}
                  <Link href="/terms" className="text-[#09724a] hover:underline">
                    Hizmet Şartları
                  </Link>
                  {" "}ve{" "}
                  <Link href="/privacy" className="text-[#09724a] hover:underline">
                    Gizlilik Politikası
                  </Link>
                  'nı kabul ediyorum
                </label>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                variant="primary"
                size="default"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
              </Button>

              {/* Login Link */}
              <p className="text-center text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px]">
                Zaten hesabınız var mı?{" "}
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

        {/* Right Panel - Decorative */}
        <div className="flex-1 h-full flex items-center justify-center px-16">
          <div className="w-[778px] h-[976px] rounded-[30px] bg-white/40 border border-white backdrop-blur-sm p-16 flex flex-col">
            {/* Logo */}
            <div className="w-[82px] h-[82px] rounded-[9.85px] bg-[#09724a] flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#e1eee3] border border-[#09724a]" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-[32px] font-semibold text-[#000000] leading-[41.6px] tracking-[-0.96px] text-center mb-4">
                Etkinlik Yönetimi Yolculuğunuza Başlayın
              </h2>
              <p className="text-[16px] text-[#000000]/60 leading-[24px] tracking-[-0.32px] text-center">
                Etkinlikler oluşturun ve yönetin, bilet satın ve başarınızı tek bir yerde takip edin.
              </p>
            </div>

            {/* Illustration */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-[567px] h-[441px] bg-gradient-to-br from-[#09724a]/20 to-transparent rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-[100px] h-[100px] rounded-full bg-[#09724a]/20 mx-auto mb-4" />
                  <p className="text-[#09724a] font-medium">Etkinlik Yönetimi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      // Transform form data to match API expectations
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-primary/20 -translate-x-1/2 -translate-y-1/2 -top-[200px] -left-[200px] blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-secondary/20 translate-x-1/2 translate-y-1/2 bottom-0 right-0 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
          <div className="w-full max-w-[420px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                <div className="w-5 h-5 rounded-full bg-white/90" />
              </div>
              <span className="text-2xl font-semibold text-on-surface">
                Biletim
              </span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="display-sm text-on-surface mb-3">
                Hesap Oluştur
              </h1>
              <p className="body-lg text-on-surface-variant">
                Biletim'e katılın ve etkinliklerinizi yönetmeye bugün başlayın.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block label-md text-on-surface-variant mb-2">
                  Ad Soyad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                  <Input
                    {...register("name")}
                    type="text"
                    placeholder="Adınızı ve soyadınızı girin"
                    className="pl-10"
                    error={!!errors.name}
                  />
                </div>
                {errors.name && (
                  <p className="body-sm text-danger mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block label-md text-on-surface-variant mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="E-posta adresinizi girin"
                    className="pl-10"
                    error={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="body-sm text-danger mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block label-md text-on-surface-variant mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="body-sm text-danger mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block label-md text-on-surface-variant mb-2">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="body-sm text-danger mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-1" />
                <label
                  htmlFor="terms"
                  className="body-md text-on-surface-variant cursor-pointer"
                >
                  {" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Hizmet Şartları
                  </Link>
                  {" "}ve{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
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
              <p className="text-center body-lg text-on-surface-variant">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-primary-dark"
                >
                  Giriş Yap
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right Panel - Decorative */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center px-16 relative">
          <div className="w-full max-w-[600px] glass-card rounded-3xl p-12 flex flex-col">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-8 shadow-glow">
              <div className="w-12 h-12 rounded-full bg-white/20" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="display-md text-on-surface text-center mb-4">
                Etkinlik Yönetimi Yolculuğunuza Başlayın
              </h2>
              <p className="body-lg text-on-surface-variant text-center">
                Etkinlikler oluşturun ve yönetin, bilet satın ve başarınızı tek bir yerde takip edin.
              </p>
            </div>

            {/* Illustration */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto mb-6 shadow-glow animate-float" />
                  <p className="title-lg text-primary">Etkinlik Yönetimi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

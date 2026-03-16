"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth.schema";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      console.log("Login attempt with:", data.email);
      await login(data);
      console.log("Login successful, redirecting...");
      router.push("/");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      if (error && typeof error === "object" && "message" in error) {
        setErrorMessage((error as { message: string }).message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex relative overflow-hidden">
      {/* Decorative Background Elements - From Figma */}
      <div className="absolute top-0 left-0 w-[1192px] h-[670px] rounded-full bg-[#09724a] opacity-100 -translate-x-1/2 -translate-y-1/2 -left-[525px] -top-[265px]" />
      <div className="absolute bottom-0 right-0 w-[778px] h-[604px] rounded-full bg-[#09724a] opacity-80 translate-x-1/2 translate-y-1/2 right-[1040px] top-[274px]" />
      <div className="absolute bottom-0 left-0 w-[824px] h-[325px] rounded-full bg-[#097247a] opacity-80 -translate-x-1/2 -translate-y-1/2 -left-[225px] top-[972px]" />

      {/* Main Content */}
      <div className="relative z-10 w-full h-screen flex">
        {/* Left Panel - Login Form */}
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

          {/* Login Form */}
          <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[24px] font-bold text-[#0d0d12] leading-[31.2px] tracking-[-0.48px] mb-2">
                Tekrar Hoş Geldiniz
              </h1>
              <p className="text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px]">
                Sizi tekrar görmek güzel. Hesabınıza giriş yapın.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="Şifrenizi girin"
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

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 bg-[#fff0f3] border border-[#df1c41] rounded-lg">
                  <p className="text-[14px] text-[#df1c41] text-center">{errorMessage}</p>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    {...register("rememberMe")}
                    id="remember"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[14px] text-[#0d0d12] leading-[21px] cursor-pointer"
                  >
                    Beni hatırla
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-[14px] font-medium text-[#09724a] leading-[21px] tracking-[0.28px]"
                >
                  Şifremi Unuttum?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                size="default"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>

              {/* Register Link */}
              <p className="text-center text-[16px] text-[#666d80] leading-[24px] tracking-[0.32px]">
                Hesabınız yok mu?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#09724a]"
                >
                  Kayıt Ol
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
                Etkinlik Yönetimi ve Takım İşbirliği İçin Optimize Edilmiş CRM
              </h2>
              <p className="text-[16px] text-[#000000]/60 leading-[24px] tracking-[-0.32px] text-center">
                Biletim ile çalışma alanınızı kurun, görev atayın ve ekibinizin verimliliğini ilk günden itibaren artıran araçlara erişin.
              </p>
            </div>

            {/* Illustration */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-[567px] h-[441px] bg-gradient-to-br from-[#09724a]/20 to-transparent rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-[100px] h-[100px] rounded-full bg-[#09724a]/20 mx-auto mb-4" />
                  <p className="text-[#09724a] font-medium">Panel Önizlemesi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

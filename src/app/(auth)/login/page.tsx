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
      console.log("🔐 [LOGIN] Başlıyor...", data.email);
      await login(data);
      console.log("✅ [LOGIN] Başarılı! User ve token set edildi");
      console.log("🔄 [LOGIN] Dashboard'a yönlendiriliyor...");
      // Use window.location.href instead of router.push to avoid race condition
      // This ensures the page fully reloads and reads from localStorage
      window.location.href = "/";
    } catch (error: unknown) {
      console.error("❌ [LOGIN] Hata:", error);
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
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-[9.85px] bg-[#09724a] flex items-center justify-center flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-[#e1eee3] border border-[#09724a]" />
            </div>
            <span className="text-[24.6px] font-bold text-[#0d0d12] leading-[33.23px]">
              Biletim
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#0d0d12] leading-[1.2] mb-2">
              Tekrar Hoş Geldiniz
            </h1>
            <p className="text-[16px] text-[#666d80] leading-[1.5]">
              Sizi tekrar görmek güzel. Hesabınıza giriş yapın.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898] pointer-events-none" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="E-posta adresinizi girin"
                  className="pl-10"
                  error={!!errors.email}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-[13px] text-[#df1c41] mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[14px] font-medium text-[#666d80] leading-[21px] mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898] pointer-events-none" />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi girin"
                  className="pl-10 pr-12"
                  error={!!errors.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#818898] hover:text-[#0d0d12] transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[13px] text-[#df1c41] mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 bg-[#fff0f3] border border-[#df1c41] rounded-lg">
                <p className="text-[13px] text-[#df1c41] text-center">{errorMessage}</p>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  {...register("rememberMe")}
                  id="remember"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-[14px] text-[#0d0d12] leading-[21px] cursor-pointer select-none"
                >
                  Beni hatırla
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-[14px] font-medium text-[#09724a] leading-[21px] hover:text-[#07653f] transition-colors"
              >
                Şifremi Unuttum?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="default"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>

            {/* Register Link */}
            <p className="text-center text-[16px] text-[#666d80] leading-[24px] pt-2">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#09724a] hover:text-[#07653f] transition-colors"
              >
                Kayıt Ol
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel - Decorative - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-[#09724a] items-center justify-center px-8 xl:px-16 py-12 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#09724a] to-[#0d5c3e] opacity-100" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2"
               style={{ left: '20%', top: '10%' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 translate-x-1/2 translate-y-1/2"
               style={{ right: '15%', bottom: '20%' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[500px] text-center">
          {/* Logo */}
          <div className="w-[82px] h-[82px] rounded-[9.85px] bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#e1eee3] border border-[#09724a]" />
          </div>

          {/* Text Content */}
          <h2 className="text-[28px] lg:text-[32px] font-semibold text-white leading-[1.3] tracking-[-0.96px] mb-4">
            Etkinlik Yönetimi ve Takım İşbirliği İçin Optimize Edilmiş CRM
          </h2>
          <p className="text-[15px] lg:text-[16px] text-white/80 leading-[1.6] mb-8">
            Biletim ile çalışma alanınızı kurun, görev atayın ve ekibinizin verimliliğini ilk günden itibaren artıran araçlara erişin.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[14px] text-white/90">Kolay Etkinlik Yönetimi</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[14px] text-white/90">Gelişmiş Raporlama</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[14px] text-white/90">Güvenli Ödeme</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[14px] text-white/90">7/24 Destek</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Panel - Login Form */}
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
              Tekrar Hoş Geldiniz
            </h1>
            <p className="body-lg text-on-surface-variant">
              Sizi tekrar görmek güzel. Hesabınıza giriş yapın.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block label-md text-on-surface-variant mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 pointer-events-none" />
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
                <p className="body-sm text-danger mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block label-md text-on-surface-variant mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 pointer-events-none" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="body-sm text-danger mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl">
                <p className="body-sm text-danger text-center">{errorMessage}</p>
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
                  className="body-md text-on-surface leading-relaxed cursor-pointer select-none"
                >
                  Beni hatırla
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="body-md text-primary hover:text-primary-dark transition-colors"
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
            <p className="text-center body-lg text-on-surface-variant pt-2">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Kayıt Ol
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel - Decorative - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 items-center justify-center px-8 xl:px-16 py-12 relative overflow-hidden bg-gradient-primary">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-mesh-gradient mesh-animated opacity-30" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2"
               style={{ left: '20%', top: '10%' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 translate-x-1/2 translate-y-1/2"
               style={{ right: '15%', bottom: '20%' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[500px] text-center">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 mx-auto">
            <div className="w-12 h-12 rounded-full bg-white/20" />
          </div>

          {/* Text Content */}
          <h2 className="display-md text-white leading-tight mb-4">
            Etkinlik Yönetimi ve Takım İşbirliği İçin Optimize Edilmiş CRM
          </h2>
          <p className="body-lg text-white/80 leading-relaxed mb-8">
            Biletim ile çalışma alanınızı kurun, görev atayın ve ekibinizin verimliliğini ilk günden itibaren artıran araçlara erişin.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: "✓", text: "Kolay Etkinlik Yönetimi" },
              { icon: "✓", text: "Gelişmiş Raporlama" },
              { icon: "✓", text: "Güvenli Ödeme" },
              { icon: "✓", text: "7/24 Destek" },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">{feature.icon}</span>
                </div>
                <span className="body-md text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

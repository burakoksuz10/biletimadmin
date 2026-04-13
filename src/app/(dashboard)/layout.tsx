"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🏠 [DASHBOARD LAYOUT] Mounted:", mounted);
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("🔍 [DASHBOARD LAYOUT] Auth kontrolü - mounted:", mounted, "isLoading:", isLoading, "user:", user ? "var" : "yok");
    if (mounted && !isLoading && !user) {
      console.log("⚠️ [DASHBOARD LAYOUT] User yok, login'e yönlendiriliyor...");
      router.push("/login");
    }
  }, [user, isLoading, router, mounted]);

  if (!mounted || isLoading) {
    console.log("⏳ [DASHBOARD LAYOUT] Loading gösteriliyor...");
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-pulse shadow-glow">
            <div className="w-6 h-6 rounded-full bg-white/90" />
          </div>
          <p className="body-md text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("❌ [DASHBOARD LAYOUT] User yok, null döndürülüyor");
    return null;
  }

  console.log("✅ [DASHBOARD LAYOUT] Dashboard render ediliyor, user:", user.name);

  return (
    <div className="min-h-screen">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <Header sidebarCollapsed={isSidebarCollapsed} />
      <main
        className={`pt-header transition-all duration-300 ${
          isSidebarCollapsed ? "ml-[80px]" : "ml-sidebar"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

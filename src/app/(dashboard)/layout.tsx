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
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-[9.85px] bg-[#09724a] flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#e1eee3] border border-[#09724a]" />
          </div>
          <p className="text-[14px] text-[#666d80]">Loading...</p>
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
    <div className="min-h-screen bg-[#f7f7f7]">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <Header sidebarCollapsed={isSidebarCollapsed} />
      <main
        className={`pt-[72px] transition-all duration-300 ${
          isSidebarCollapsed ? "ml-[80px]" : "ml-[300px]"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

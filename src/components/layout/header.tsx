"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, User, LogOut, ChevronDown, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 h-header glass-nav border-b border-outline/20 transition-all duration-300 z-30 ${
        sidebarCollapsed ? "left-[80px]" : "left-sidebar"
      }`}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <Input
              type="search"
              placeholder="Ara..."
              className="w-64 pl-10 h-10 bg-surface-highest/50"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-surface-low/50 hover:bg-surface-low flex items-center justify-center transition-colors"
            title={theme === "dark" ? "Aydınlık Mod" : "Karanlık Mod"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-on-surface-variant" />
            ) : (
              <Moon className="w-5 h-5 text-on-surface-variant" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-xl bg-surface-low/50 hover:bg-surface-low flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <Badge
              variant="danger"
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
              dot={false}
            >
              3
            </Badge>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-low/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-on-surface leading-tight">
                  {user?.name || "Admin Kullanıcı"}
                </p>
                <p className="text-xs text-on-surface-variant leading-tight">
                  {user?.role === "super_admin" ? "Süper Admin" : user?.role === "org_admin" ? "Org. Admin" : "Co-Admin"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-on-surface-variant" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl shadow-glow py-2">
                <Link
                  href="/settings/account"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-low"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  Profil
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-low"
                  onClick={() => setShowUserMenu(false)}
                >
                  Ayarlar
                </Link>
                <div className="my-2 h-px bg-outline/20" />
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-danger hover:bg-danger/10"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

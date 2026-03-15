"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 h-[72px] bg-white border-b border-[#e5e7eb] transition-all duration-300 z-30 ${
        sidebarCollapsed ? "left-[80px]" : "left-[300px]"
      }`}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
            <Input
              type="search"
              placeholder="Ara..."
              className="w-[240px] h-10 pl-10 rounded-lg bg-[#f7f7f7] border-[#e5e7eb] focus:bg-white"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-lg bg-[#f7f7f7] border border-[#e5e7eb] flex items-center justify-center hover:bg-[#e5e7eb] transition-colors">
            <Bell className="w-5 h-5 text-[#666d80]" />
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f7f7f7] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#e1eee3] border border-[#09724a] flex items-center justify-center">
                <User className="w-5 h-5 text-[#09724a]" />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-semibold text-[#0d0d12] leading-[18px]">
                  {user?.name || "Admin Kullanıcı"}
                </p>
                <p className="text-[12px] text-[#666d80] leading-[18px]">
                  {user?.role === "SUPER_ADMIN" ? "Süper Admin" : user?.role === "ORG_ADMIN" ? "Org. Admin" : "Co-Admin"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#666d80]" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-[#e5e7eb] shadow-lg py-2">
                <Link
                  href="/settings/account"
                  className="flex items-center gap-3 px-4 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  Profil
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                  onClick={() => setShowUserMenu(false)}
                >
                  Ayarlar
                </Link>
                <hr className="my-2 border-[#e5e7eb]" />
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-[14px] text-[#df1c41] hover:bg-[#fff0f3]"
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

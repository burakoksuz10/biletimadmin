"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  FileText,
  Ticket,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Organizatörler",
    href: "/organizations",
    icon: Building2,
  },
  {
    title: "Mekanlar",
    href: "/venues",
    icon: MapPin,
  },
  {
    title: "Etkinlikler",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Müşteriler",
    href: "/customers",
    icon: UserCheck,
  },
  {
    title: "Kullanıcılar",
    href: "/users",
    icon: Users,
  },
  {
    title: "Ödemeler",
    href: "/payouts",
    icon: CreditCard,
  },
  {
    title: "Raporlar",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Bilet Satışları",
    href: "/ticket-sales",
    icon: Ticket,
  },
  {
    title: "Ayarlar",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-[#e5e7eb] transition-all duration-300 z-40",
        isCollapsed ? "w-[80px]" : "w-[300px]"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-[#e5e7eb]">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[9.85px] bg-[#09724a] flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#e1eee3] border border-[#09724a]" />
              </div>
              <span className="text-[20px] font-bold text-[#0d0d12]">
                Biletim
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-[9.85px] bg-[#09724a] flex items-center justify-center mx-auto">
              <div className="w-6 h-6 rounded-full bg-[#e1eee3] border border-[#09724a]" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                      isActive
                        ? "bg-[#e1eee3] text-[#09724a]"
                        : "text-[#666d80] hover:bg-[#f7f7f7] hover:text-[#0d0d12]",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-[14px] font-medium">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-[#e5e7eb]">
          <button
            onClick={onToggle}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[#666d80] hover:bg-[#f7f7f7] hover:text-[#0d0d12] transition-colors",
              isCollapsed && "justify-center"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-[14px] font-medium">Daralt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

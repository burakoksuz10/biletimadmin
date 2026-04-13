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
        "fixed left-0 top-0 h-screen glass-nav border-r border-outline/20 transition-all duration-300 z-40",
        isCollapsed ? "w-[80px]" : "w-sidebar"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-header flex items-center justify-between px-6 border-b border-outline/20">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <div className="w-5 h-5 rounded-full bg-white/90" />
              </div>
              <span className="text-xl font-semibold text-on-surface">
                Biletim
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto shadow-glow">
              <div className="w-5 h-5 rounded-full bg-white/90" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                      isActive
                        ? "bg-gradient-primary text-white shadow-glow"
                        : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">
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
        <div className="p-4 border-t border-outline/20">
          <button
            onClick={onToggle}
            className={cn(
              "flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-on-surface-variant hover:bg-surface-low hover:text-on-surface transition-all duration-200",
              isCollapsed && "justify-center"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Daralt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

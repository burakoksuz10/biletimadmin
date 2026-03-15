"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  FileText,
  Settings as SettingsIcon,
  Globe,
  Key,
  HelpCircle,
} from "lucide-react";

const settingsNav = [
  { href: "/settings", label: "Genel", icon: SettingsIcon },
  { href: "/settings/account", label: "Hesap", icon: User },
  { href: "/settings/notifications", label: "Bildirimler", icon: Bell },
  { href: "/settings/security", label: "Güvenlik", icon: Shield },
  { href: "/settings/payment", label: "Ödeme", icon: CreditCard },
  { href: "/settings/billing", label: "Faturalandırma", icon: FileText },
  { href: "/settings/integrations", label: "Entegrasyonlar", icon: Globe },
  { href: "/settings/api", label: "API", icon: Key },
  { href: "/settings/help", label: "Yardım", icon: HelpCircle },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#e1eee3] text-[#09724a]"
                    : "text-[#666d80] hover:bg-[#f7f7f7] hover:text-[#0d0d12]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

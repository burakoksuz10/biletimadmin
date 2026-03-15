"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (props: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: "success" });
    },
    [toast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: "error", duration: 7000 });
    },
    [toast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: "warning" });
    },
    [toast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: "info" });
    },
    [toast]
  );

  const variantStyles = {
    default: "bg-white border-[#e5e7eb] text-[#0d0d12]",
    success: "bg-[#ecfdf3] border-[#10b981] text-[#065f46]",
    error: "bg-[#fef2f2] border-[#ef4444] text-[#991b1b]",
    warning: "bg-[#fffbeb] border-[#f59e0b] text-[#92400e]",
    info: "bg-[#eff6ff] border-[#3b82f6] text-[#1e40af]",
  };

  const variantIcons = {
    default: null,
    success: <CheckCircle className="w-5 h-5 text-[#10b981]" />,
    error: <AlertCircle className="w-5 h-5 text-[#ef4444]" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />,
    info: <Info className="w-5 h-5 text-[#3b82f6]" />,
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${variantStyles[t.variant]} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right`}
          >
            {variantIcons[t.variant]}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{t.title}</p>
              {t.description && (
                <p className="text-sm mt-1 opacity-90">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

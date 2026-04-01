"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up") || pathname === "/";

  if (isAuthPage) {
    return (
      <main className="flex-1 min-h-screen relative z-10 flex items-center justify-center p-4">
        {children}
      </main>
    );
  }

  return (
    <>
      <ClerkLoading>
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0b] animate-in fade-in duration-500">
          <div className="relative group p-1">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl relative z-10 animate-pulse">
              <Sparkles className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <p className="mt-6 text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase animate-pulse">
            Authenticating
          </p>
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen relative z-10">
          <div className="max-w-7xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {children}
          </div>
        </main>
      </ClerkLoaded>
    </>
  );
}

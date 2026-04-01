"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, TrendingUp, User, Sparkles, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: ReceiptText },
  { name: 'Investments', href: '/investments', icon: TrendingUp },
  { name: 'Exchange', href: '/exchange', icon: RefreshCcw },
  { name: 'Profile', href: '/profile', icon: User },
];

import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0a0a0b]/80 backdrop-blur-2xl flex flex-col h-screen fixed top-0 left-0 z-50">
      <div className="p-6 h-full flex flex-col">
        <h1 className="text-2xl font-extrabold tracking-tight mb-10 mt-2 flex items-center space-x-3 text-foreground">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span>Finevus</span>
        </h1>
        
        <div className="text-xs font-semibold text-muted-foreground/50 tracking-wider uppercase mb-4 px-3">Menu</div>
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 ease-out group relative overflow-hidden",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold shadow-inner" 
                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground font-medium hover:translate-x-1"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                )}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none",
                  !isActive && "group-hover:opacity-100"
                )} />
                <Icon className={cn("w-5 h-5 transition-colors relative z-10", isActive ? "text-primary" : "group-hover:text-primary/70")} />
                <span className="relative z-10 text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 ease-out group hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20 font-medium"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-sm tracking-wide">Logout</span>
          </button>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 rounded-xl",
                  userButtonTrigger: "focus:shadow-none focus:outline-none"
                }
              }}
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{user?.fullName || "Welcome back"}</p>
              <p className="text-xs text-muted-foreground/80 truncate group-hover:text-primary transition-colors font-medium">
                {user?.primaryEmailAddress?.emailAddress || "Checking session..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

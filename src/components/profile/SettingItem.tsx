"use client";

import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function SettingItem({
  icon: Icon,
  title,
  description,
  onClick,
  children,
  className,
}: SettingItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-white/5 hover:bg-white/5",
        onClick ? "active:scale-[0.98]" : "cursor-default",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground tracking-wide">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {children}
        {onClick && (
          <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </div>
  );
}

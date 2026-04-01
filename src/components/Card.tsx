import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div 
      className={cn(
        "group relative rounded-2xl p-6 overflow-hidden",
        "bg-card/40 backdrop-blur-2xl",
        "border border-white/5",
        "shadow-lg shadow-black/40",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:scale-[1.02]",
        "hover:bg-card/60 hover:border-primary/20",
        "hover:shadow-[0_8px_30px_-4px_rgba(34,197,94,0.15)]",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-opacity duration-500 opacity-40 group-hover:opacity-100 group-hover:via-primary/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("font-semibold text-muted-foreground/80 text-xs tracking-wider uppercase mb-1", className)}>{children}</h3>;
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Finevus | AI Finance Dashboard",
  description: "Manage your expenses and investments elegantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: undefined,
        variables: { 
          colorPrimary: '#22c55e',
          colorText: '#ffffff'
        },
        elements: {
          card: "bg-[#121214] border border-white/5 shadow-2xl",
          headerTitle: "text-white font-extrabold",
          headerSubtitle: "text-zinc-400",
          formFieldLabel: "text-zinc-400 font-medium",
          formFieldInput: "bg-white/5 border-white/10 text-white focus:border-primary focus:ring-primary",
          otpCodeFieldInput: "text-white bg-white/5 border-white/10",
          socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold",
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold",
          footerActionLink: "text-primary hover:text-primary/80 font-bold"
        }
      }}
    >
      <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex antialiased overflow-x-hidden`}>
        {/* Background glow effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0a0a0b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '16px',
              fontWeight: 'bold'
            },
            success: { iconTheme: { primary: 'var(--primary)', secondary: 'black' } },
            error: { iconTheme: { primary: 'var(--destructive)', secondary: 'white' } },
          }} 
        />
      </body>
    </html>
    </ClerkProvider>
  );
}

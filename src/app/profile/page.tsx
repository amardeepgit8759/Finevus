"use client";

import { useState, useTransition } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { 
  Mail, 
  Shield, 
  Bell, 
  CheckCircle2, 
  Crown, 
  User as UserIcon,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Lock,
  Loader2
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/Card";
import { SettingItem } from "@/components/profile/SettingItem";
import { Toggle } from "@/components/ui/Toggle";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import toast from "react-hot-toast";
import useSWR from "swr";
import Script from "next/script";

const fetcher = (url: string) => fetch(url).then(res => res.json());

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProfilePage() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const { data: dbUser, isLoading: isDbLoading, mutate: mutateUser } = useSWR("/api/user/status", fetcher);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isClerkLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-white/5 mb-4" />
          <div className="h-6 w-32 bg-white/5 rounded-full" />
        </div>
      </div>
    );
  }

  const isPro = dbUser?.isPro;

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      // 1. Create order
      const res = await fetch("/api/create-order", { method: "POST" });
      const orderData = await res.json();
      
      if (!orderData.id) {
        toast.error(orderData.error || "Failed to initiate order.");
        return;
      }

      // 2. Open Razorpay Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Finevus",
        description: "Pro Membership Upgrade",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            toast.success("Welcome to Finevus Pro! 🚀");
            mutateUser(); // Re-fetch user status
          } else {
            toast.error(verifyData.error || "Payment verification failed.");
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#22c55e",
        },
        modal: {
          ondismiss: function() {
            setIsUpgrading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("A network error occurred.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handlePasswordUpdate = () => {
    openUserProfile({
      appearance: {
        elements: {
          modalBackdrop: "bg-black/60 backdrop-blur-md",
          card: "bg-card border border-border shadow-2xl rounded-3xl",
        }
      }
    });
  };

  const handleEmailUpdate = () => {
    toast.error("Email updates are managed through your account security settings.");
    handlePasswordUpdate(); // Redirect to the same secure modal
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
          Profile Settings
        </h2>
        <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">
          Manage your identity, security, and preferences across Finevus.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-primary/10 bg-gradient-to-br from-card to-primary/5 p-0 overflow-hidden group">
          <div className="p-8 flex flex-col items-center text-center relative">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Crown className="w-6 h-6 text-yellow-500/50 animate-pulse" />
            </div>

            <div className="relative group/avatar mb-6">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover/avatar:opacity-40 transition-opacity" />
              <div className="w-28 h-28 rounded-3xl overflow-hidden bg-primary/20 flex items-center justify-center border-2 border-primary/20 group-hover/avatar:border-primary/50 transition-all shadow-2xl relative z-10 scale-100 group-hover/avatar:scale-105 duration-500">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-primary" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-2xl tracking-tight flex items-center justify-center">
                {user.fullName || "Member"}
                {(user.primaryEmailAddress?.verification.status === "verified" || isPro) && (
                  <ShieldCheck className="w-5 h-5 text-primary ml-2 mb-0.5" />
                )}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                {isPro ? "Active Pro" : "Standard"}
              </span>
              {isPro && (
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/20 flex items-center">
                  <Crown className="w-3 h-3 mr-1" /> Pro Member
                </span>
              )}
            </div>

            <div className="mt-8 w-full space-y-3">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="w-full bg-white/5 border border-white/5 text-foreground py-3.5 rounded-2xl font-extrabold text-sm hover:bg-white/10 transition-all"
              >
                Edit Profile
              </button>
              
              {!isPro && (
                <button 
                  onClick={handleUpgrade}
                  disabled={isUpgrading || isDbLoading}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-extrabold text-sm shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-primary/90 flex items-center justify-center disabled:opacity-50"
                >
                  {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Upgrade to Pro • ₹499</>}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Account Details */}
        <Card className="lg:col-span-2 p-8 space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold tracking-tight">Account Intelligence</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{isPro ? "Full Access Enabled" : "Basic Access"}</p>
          </div>

          <div className="space-y-2">
            <SettingItem
              icon={Mail}
              title="Email Address"
              description={user.primaryEmailAddress?.emailAddress || "Set your primary email"}
              onClick={handleEmailUpdate}
            />

            <div className="h-px bg-white/5 mx-4" />

            <SettingItem
              icon={Lock}
              title="Security & Password"
              description="Keep your account protected with 2FA and secure keys"
              onClick={handlePasswordUpdate}
            />

            <div className="h-px bg-white/5 mx-4" />

            <SettingItem
              icon={Bell}
              title="Notifications"
              description="Get instant alerts for large transactions & activity"
            >
              <Toggle enabled={notifications} onChange={setNotifications} />
            </SettingItem>
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="p-6 rounded-2xl bg-[#ef4444]/5 border border-[#ef4444]/10 group transition-colors hover:bg-[#ef4444]/10 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-[#ef4444]/20 text-[#ef4444]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#ef4444] tracking-wide">Danger Zone</h4>
                    <p className="text-xs text-[#ef4444]/60 mt-0.5 font-medium">Download your data or request account deletion</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#ef4444]/50 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}


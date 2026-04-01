"use client";

import { useState } from "react";
import { X, Save, Loader2, Coins, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAssetModal({ isOpen, onClose }: Props) {
  const { mutate } = useSWRConfig();
  const [name, setName] = useState("");
  const [type, setType] = useState<"STOCK" | "CRYPTO">("STOCK");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [adding, setAdding] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !quantity) return;

    setAdding(true);
    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          amount: Number(amount) || 0,
          quantity: Number(quantity) || 0,
        }),
      });

      if (res.ok) {
        toast.success("Asset added successfully!");
        mutate("/api/investments");
        setName("");
        setAmount("");
        setQuantity("");
        onClose();
      } else {
        toast.error("Failed to add asset.");
      }
    } catch (err) {
      console.error(err);
      toast.error("A network error occurred.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">Add New Asset</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setType("STOCK")}
              className={`py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center ${type === "STOCK" ? "bg-primary/20 text-primary border border-primary/30 shadow-inner" : "text-muted-foreground hover:text-foreground border border-transparent"}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Stock
            </button>
            <button
              type="button"
              onClick={() => setType("CRYPTO")}
              className={`py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center ${type === "CRYPTO" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-inner" : "text-muted-foreground hover:text-foreground border border-transparent"}`}
            >
              <Coins className="w-4 h-4 mr-2" />
              Crypto
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Asset Name / Symbol</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              className="w-full bg-[#0a0a0b]/70 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-foreground font-bold transition-all shadow-inner"
              placeholder="e.g. AAPL or BTC"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Amount Invested</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-extrabold">₹</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#0a0a0b]/70 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-foreground font-bold transition-all shadow-inner"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Quantity</label>
              <input
                type="number"
                step="0.000001"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#0a0a0b]/70 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-foreground font-bold transition-all shadow-inner"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adding}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-extrabold flex items-center shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Add Asset</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

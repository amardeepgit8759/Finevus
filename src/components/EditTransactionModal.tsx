"use client";

import { useState, useEffect } from "react";
import { Loader2, X, Save } from "lucide-react";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  date: string;
}

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onSuccess: (updatedTx: Transaction) => void;
}

export function EditTransactionModal({ transaction, onClose, onSuccess }: Props) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      // Clean subset ISO string logic if needed, fallback to today
      if (transaction.date) {
        setDate(new Date(transaction.date).toISOString().split("T")[0]);
      }
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: Number(amount) || 0,
          category,
          date
        })
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedTx = await res.json();
      onSuccess(updatedTx);
    } catch (err) {
      console.error(err);
      setError("Failed to update transaction.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">Edit Transaction</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 text-sm font-bold bg-destructive/20 text-destructive border border-destructive/30 rounded-lg">{error}</div>}
          
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
            <button 
              type="button"
              onClick={() => setType("EXPENSE")}
              className={`py-2 text-sm font-bold rounded-lg transition-all duration-300 ${type === "EXPENSE" ? "bg-destructive/20 text-destructive border border-destructive/30 shadow-inner" : "text-muted-foreground hover:text-foreground border border-transparent"}`}
            >
              Expense
            </button>
            <button 
              type="button"
              onClick={() => setType("INCOME")}
              className={`py-2 text-sm font-bold rounded-lg transition-all duration-300 ${type === "INCOME" ? "bg-primary/20 text-primary border border-primary/30 shadow-inner" : "text-muted-foreground hover:text-foreground border border-transparent"}`}
            >
              Income
            </button>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-extrabold">₹</span>
              <input 
                type="number" 
                step="0.01"
                required 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-[#0a0a0b]/70 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-foreground font-bold transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Category</label>
            <input 
              type="text" 
              required 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#0a0a0b]/70 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-foreground font-bold transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Date</label>
            <input 
              type="date" 
              required 
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[#0a0a0b]/70 border border-white/10 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-muted-foreground font-bold transition-all shadow-inner"
            />
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
              disabled={saving}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-extrabold flex items-center shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Loader2, Trash2, Edit2 } from "lucide-react";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import useSWR, { useSWRConfig } from "swr";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  date: string;
}

export function RecentTransactions() {
  const { data: txData, isLoading } = useSWR("/api/transactions", fetcher);
  const { mutate } = useSWRConfig();
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const transactions = (Array.isArray(txData) ? txData : []).slice(0, 5);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      
      toast.success("Transaction deleted");
      mutate("/api/transactions");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete transaction");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full h-full overflow-y-auto pr-2 pb-6">
      {transactions.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground text-sm font-medium">
          No transactions found. Add some!
        </div>
      ) : (
        transactions.map((tx) => (
          <div key={tx.id} className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl shadow-sm ${tx.type === "INCOME" ? "bg-primary/10 text-primary shadow-primary/10" : "bg-destructive/10 text-destructive shadow-destructive/10"}`}>
                {tx.type === "INCOME" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[15px] font-bold text-foreground tracking-wide">{tx.category}</p>
                <p className="text-xs text-muted-foreground/80 mt-0.5 font-semibold">{new Date(tx.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              <div className={`text-lg font-extrabold tracking-tight mr-3 ${tx.type === "INCOME" ? "text-primary" : "text-destructive"}`}>
                {tx.type === "INCOME" ? "+" : "-"}₹{(Number(tx.amount) || 0).toFixed(2)}
              </div>
              <button 
                onClick={() => setEditingTx(tx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-primary shrink-0"
                title="Edit Transaction"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(tx.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive shrink-0"
                title="Delete Transaction"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
      <EditTransactionModal 
        transaction={editingTx} 
        onClose={() => setEditingTx(null)}
        onSuccess={() => {
          toast.success("Transaction updated");
          mutate("/api/transactions");
          setEditingTx(null);
        }}
      />
    </div>
  );
}

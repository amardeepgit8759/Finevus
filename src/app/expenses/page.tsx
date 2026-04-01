"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/Card";
import { ExpensesChart } from "@/components/ExpensesChart";
import { ReceiptText, Plus, Loader2, ArrowDownRight, ArrowUpRight, Trash2, Edit2 } from "lucide-react";
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

export default function ExpensesPage() {
  const { data: txData, isLoading } = useSWR("/api/transactions", fetcher);
  const { mutate } = useSWRConfig();
  
  const [adding, setAdding] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const transactions = Array.isArray(txData) ? txData : [];

  // Form State
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    setAdding(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: Number(amount) || 0,
          category,
          date
        })
      });
      
      if (res.ok) {
        toast.success("Transaction saved successfully!");
        mutate("/api/transactions");
        setAmount("");
        setCategory("");
      } else {
        toast.error("Failed to save transaction.");
      }
    } catch (e) {
      console.error(e);
      toast.error("A network error occurred.");
    } finally {
      setAdding(false);
    }
  };

  const totalExpense = (Array.isArray(transactions) ? transactions : [])
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Expenses Tracker</h2>
          <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">Add, track and visualize all your custom financial transactions.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-1">
        {/* Form Card */}
        <Card className="lg:col-span-1 border-primary/20 sticky top-6 self-start">
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/5">
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
                  placeholder="0.00"
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
                placeholder="e.g. Utilities"
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

            <button 
              type="submit" 
              disabled={adding}
              className="w-full bg-primary text-primary-foreground py-3.5 mt-2 rounded-xl font-extrabold tracking-wide flex items-center justify-center hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Plus className="w-5 h-5 mr-1" />
                  SAVE TRANSACTION
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Ledger and Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Breakdown</CardTitle>
            </CardHeader>
            <div className="h-48 mt-2 relative">
              <ExpensesChart transactions={transactions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-muted-foreground font-bold tracking-wider uppercase">Total Expenses</span>
                <span className="text-3xl font-extrabold tracking-tighter text-destructive mt-1">
                  -₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </Card>

          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ReceiptText className="w-4 h-4 mr-2" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <div className="mt-4 space-y-3">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-muted-foreground text-sm font-medium">
                  No transactions yet. Start adding!
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
                        {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toFixed(2)}
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
            </div>
          </Card>
        </div>
      </div>
      
      <EditTransactionModal 
        transaction={editingTx} 
        onClose={() => setEditingTx(null)}
        onSuccess={() => {
          toast.success("Transaction updated!");
          mutate("/api/transactions");
          setEditingTx(null);
        }}
      />
    </div>
  );
}

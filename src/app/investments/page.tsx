"use client";
export const dynamic = "force-dynamic";

import { Card, CardHeader, CardTitle } from "@/components/Card";
import { Plus, ArrowUpRight, ArrowDownRight, Bitcoin, LineChart, Loader2 } from "lucide-react";
import useSWR from "swr";
import { AddAssetModal } from "@/components/AddAssetModal";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InvestmentsPage() {
  const { data, isLoading } = useSWR("/api/investments", fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const investments = (Array.isArray(data) ? data : []).map(inv => {
    const amount = Number(inv.amount) || 0;
    const quantity = Number(inv.quantity) || 0;
    return {
      ...inv,
      // Minor random simulation for aesthetics since Prisma amount is static
      currentPrice: amount * (inv.type === "CRYPTO" ? 1.15 : 1.05),
      amount,
      quantity
    };
  });

  const totalValue = (investments.reduce((sum, inv) => sum + (inv.currentPrice * inv.quantity), 0)) || 0;
  const totalCost = (investments.reduce((sum, inv) => sum + (inv.amount * inv.quantity), 0)) || 0;
  const totalReturn = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  // Debug Logging
  console.log("Investments Portfolio Calculation:", {
    totalValue,
    totalCost,
    totalReturn,
    count: investments.length
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Investments</h2>
          <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">Track your portfolio performance across stocks and crypto.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-30 bg-primary text-primary-foreground px-4 py-2 rounded-radius font-medium flex items-center shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 ease-out"
        >
          <Plus className="w-5 h-5 mr-1" /> Add Asset
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 relative overflow-hidden">
          {isLoading && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <div className="text-5xl font-extrabold tracking-tighter text-foreground mt-2 py-1">₹{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          <p className={`text-sm flex items-center mt-3 font-bold tracking-wide ${totalReturn >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {totalReturn >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {Math.abs(totalReturn).toFixed(1)}% Total Return
          </p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="min-h-[400px] relative">
          {isLoading && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="w-4 h-4 mr-2" />
              Stocks
            </CardTitle>
          </CardHeader>
          <div className="space-y-4 mt-4">
            {investments.filter(i => i.type === "STOCK").length === 0 && !isLoading ? (
              <p className="text-muted-foreground text-center py-10 font-medium">No Stocks in Portfolio</p>
            ) : (
              investments.filter(i => i.type === "STOCK").map(inv => {
                const profit = (inv.currentPrice - inv.amount) * inv.quantity;
                const isProfit = profit >= 0;
                return (
                  <div key={inv.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-lg text-foreground">
                        {inv.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold">{inv.name}</h4>
                        <p className="text-xs text-muted-foreground">{inv.quantity} shares</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{(inv.currentPrice * inv.quantity).toFixed(2)}</div>
                      <div className={`text-sm flex items-center justify-end ${isProfit ? "text-primary" : "text-destructive"}`}>
                        {isProfit ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        ₹{Math.abs(profit).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
        
        <Card className="min-h-[400px] relative">
          {isLoading && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bitcoin className="w-4 h-4 mr-2" />
              Crypto
            </CardTitle>
          </CardHeader>
          <div className="space-y-4 mt-4">
            {investments.filter(i => i.type === "CRYPTO").length === 0 && !isLoading ? (
              <p className="text-muted-foreground text-center py-10 font-medium">No Crypto in Portfolio</p>
            ) : (
              investments.filter(i => i.type === "CRYPTO").map(inv => {
                const profit = (inv.currentPrice - inv.amount) * inv.quantity;
                const isProfit = profit >= 0;
                return (
                  <div key={inv.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center font-bold text-lg text-yellow-500 shadow-sm shadow-yellow-500/10">
                        {inv.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold">{inv.name}</h4>
                        <p className="text-xs text-muted-foreground">{inv.quantity} coins</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">₹{(inv.currentPrice * inv.quantity).toFixed(2)}</div>
                      <div className={`text-sm flex items-center justify-end ${isProfit ? "text-primary" : "text-destructive"}`}>
                        {isProfit ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        ₹{Math.abs(profit).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
      
      <AddAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

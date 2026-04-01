"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/Card";
import { RefreshCcw, ArrowRight, Loader2 } from "lucide-react";

export default function ExchangePage() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<string>("1000");
  const [targetCurrency, setTargetCurrency] = useState<string>("USD");

  const popularCurrencies = ["USD", "EUR", "GBP", "JPY", "SGD", "AUD", "CAD"];

  useEffect(() => {
    fetch("/api/exchange")
      .then(res => res.json())
      .then(data => {
        setRates(data.rates || {});
      })
      .finally(() => setLoading(false));
  }, []);

  const convertedAmount = amount ? (parseFloat(amount) * (rates[targetCurrency] || 0)).toFixed(2) : "0.00";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Currency Exchange</h2>
        <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">Live currency rates mapped directly against your base INR wallet.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCcw className="w-5 h-5 mr-2 text-primary" />
              Quick Converter
            </CardTitle>
          </CardHeader>
          <div className="mt-4 flex-1 flex flex-col justify-center space-y-6 relative">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">From (INR base)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-extrabold">₹</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#0a0a0b]/70 border border-white/10 rounded-xl pl-9 pr-3 py-4 text-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-foreground font-bold transition-all shadow-inner"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-10">
              <div className="bg-card border border-white/10 p-2.5 rounded-full shadow-lg">
                <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">To</label>
                <select 
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="bg-transparent text-sm font-extrabold text-primary focus:outline-none cursor-pointer tracking-wider"
                >
                  {popularCurrencies.map(c => <option key={c} value={c} className="bg-card text-foreground">{c}</option>)}
                </select>
              </div>
              <div className="w-full bg-[#131417]/40 border border-white/5 rounded-xl px-5 py-4 text-2xl font-extrabold text-foreground shadow-inner flex justify-between items-center">
                <span>{loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : convertedAmount}</span>
                <span className="text-sm font-semibold text-muted-foreground">{targetCurrency}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live FX Rates (vs ₹1 INR)</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="flex h-60 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
              </div>
            ) : (
              popularCurrencies.map(curr => (
                <div key={curr} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-extrabold text-primary text-sm shadow-sm transition-transform group-hover:scale-110">
                      {curr}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold tracking-wide text-foreground">1 INR</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold tracking-tight text-primary">
                      {rates[curr]?.toFixed(4) || "..."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

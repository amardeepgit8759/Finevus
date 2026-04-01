"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/Card";
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp, Wallet, RefreshCcw, Loader2 } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DashboardMetrics() {
  const [targetCurrency, setTargetCurrency] = useState<string>("INR");
  const [loadingToggle, setLoadingToggle] = useState(false);

  const { data: exchangeData } = useSWR("/api/exchange", fetcher);
  const { data: transactionsData, isLoading: loadingTx } = useSWR("/api/transactions", fetcher);
  const { data: investmentsData, isLoading: loadingInv } = useSWR("/api/investments", fetcher);

  const rates = exchangeData?.rates ? { ...exchangeData.rates, INR: 1 } : {};
  const transactions = Array.isArray(transactionsData) ? transactionsData : [];
  const investments = Array.isArray(investmentsData) ? investmentsData : [];

  const loadingMetrics = loadingTx || loadingInv;

  const totalIncome = (transactions || [])
    .filter((t: any) => t.type === "INCOME")
    .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);
    
  const totalExpenses = (transactions || [])
    .filter((t: any) => t.type === "EXPENSE")
    .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  const totalInvestments = (investments || []).reduce((sum: number, inv: any) => {
    const amount = Number(inv.amount) || 0;
    const quantity = Number(inv.quantity) || 0;
    const simulatedCurrentPrice = amount * (inv.type === "CRYPTO" ? 1.15 : 1.05);
    return sum + (simulatedCurrentPrice * quantity);
  }, 0);

  const totalBalance = (totalIncome - totalExpenses + totalInvestments) || 0;

  // Debug Logging
  console.log("Dashboard Metrics Calculation:", {
    totalIncome,
    totalExpenses,
    totalInvestments,
    totalBalance,
    txCount: transactions.length,
    invCount: investments.length
  });

  const quickCurrencies = ["INR", "USD", "EUR", "GBP"];

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (Object.keys(rates).length === 0) return;
    
    const currentIndex = quickCurrencies.indexOf(targetCurrency);
    const nextCurrency = quickCurrencies[(currentIndex + 1) % quickCurrencies.length];
    
    setLoadingToggle(true);
    setTimeout(() => {
      setTargetCurrency(nextCurrency);
      setLoadingToggle(false);
    }, 150);
  };

  const getSymbol = (curr: string) => {
    if (curr === "INR") return "₹";
    if (curr === "USD") return "$";
    if (curr === "EUR") return "€";
    if (curr === "GBP") return "£";
    return "";
  };

  const calculate = (baseInr: number) => {
    if (loadingMetrics) return "...";
    const amount = Number(baseInr) || 0;
    const factor = Number(rates[targetCurrency]) || 1;
    const converted = amount * factor;
    const sym = getSymbol(targetCurrency);
    return `${sym}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderBalanceIcon = () => {
    if (totalBalance >= 0) return <ArrowUpRight className="w-4 h-4 mr-1 text-primary" />;
    return <ArrowDownRight className="w-4 h-4 mr-1 text-destructive" />;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
          <div className="flex items-center space-x-3">
            <button onClick={handleToggle} title="Quick Convert" className="p-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all text-muted-foreground z-20">
              <RefreshCcw className={`w-3.5 h-3.5 ${loadingToggle ? 'animate-spin text-primary' : ''}`} />
            </button>
            {loadingMetrics ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Wallet className="w-5 h-5 text-primary" />}
          </div>
        </CardHeader>
        <div className={`text-5xl font-extrabold tracking-tighter text-foreground mt-2 py-1 transition-opacity duration-300 ${loadingToggle || loadingMetrics ? 'opacity-40' : 'opacity-100'}`}>
          {calculate(totalBalance)}
        </div>
        {!loadingMetrics && (
          <p className="text-sm flex items-center mt-3 font-semibold tracking-wide text-muted-foreground">
            {renderBalanceIcon()}
            Synced across Wallets
          </p>
        )}
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
          <div className="flex items-center space-x-3">
            <button onClick={handleToggle} title="Quick Convert" className="p-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all text-muted-foreground z-20">
              <RefreshCcw className={`w-3.5 h-3.5 ${loadingToggle ? 'animate-spin text-primary' : ''}`} />
            </button>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
        </CardHeader>
        <div className={`text-4xl font-extrabold tracking-tighter text-primary mt-1 transition-opacity duration-300 ${loadingToggle || loadingMetrics ? 'opacity-40' : 'opacity-100'}`}>
          +{calculate(totalIncome)}
        </div>
        <p className="text-xs text-muted-foreground/80 mt-3 font-semibold tracking-wide">All Time</p>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
          <div className="flex items-center space-x-3">
            <button onClick={handleToggle} title="Quick Convert" className="p-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 transition-all text-muted-foreground z-20">
              <RefreshCcw className={`w-3.5 h-3.5 ${loadingToggle ? 'animate-spin text-destructive' : ''}`} />
            </button>
            <ArrowDownRight className="w-5 h-5 text-destructive" />
          </div>
        </CardHeader>
        <div className={`text-4xl font-extrabold tracking-tighter text-destructive mt-1 transition-opacity duration-300 ${loadingToggle || loadingMetrics ? 'opacity-40' : 'opacity-100'}`}>
          -{calculate(totalExpenses)}
        </div>
        <p className="text-xs text-muted-foreground/80 mt-3 font-semibold tracking-wide">All Time</p>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Investments</CardTitle>
          <div className="flex items-center space-x-3">
            <button onClick={handleToggle} title="Quick Convert" className="p-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all text-muted-foreground z-20">
              <RefreshCcw className={`w-3.5 h-3.5 ${loadingToggle ? 'animate-spin text-primary' : ''}`} />
            </button>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </CardHeader>
        <div className={`text-4xl font-extrabold tracking-tighter text-foreground mt-1 transition-opacity duration-300 ${loadingToggle || loadingMetrics ? 'opacity-40' : 'opacity-100'}`}>
          {calculate(totalInvestments)}
        </div>
        <p className="text-xs text-primary flex items-center mt-3 font-semibold tracking-wide">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          Growing Fast
        </p>
      </Card>
    </div>
  );
}

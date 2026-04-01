"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DashboardChart() {
  const { data: txData, isLoading } = useSWR("/api/transactions", fetcher);

  const transactions = Array.isArray(txData) ? txData : [];
  
  let chartData: any[] = [];
  
  if (transactions.length === 0) {
    chartData = [{ name: "Today", income: 0, expenses: 0 }];
  } else {
    // Dynamically Group by Timeline
    const monthlyData = transactions.reduce((acc: any, t: any) => {
      const date = new Date(t.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const amount = Number(t.amount) || 0;
      
      if (!acc[monthYear]) {
        acc[monthYear] = { name: monthYear, income: 0, expenses: 0, sortKey: new Date(date.getFullYear(), date.getMonth(), 1).getTime() };
      }
      
      if (t.type === 'INCOME') acc[monthYear].income += amount;
      else acc[monthYear].expenses += amount;
      
      return acc;
    }, {});

    // Sort chronologically
    chartData = Object.values(monthlyData)
      .sort((a: any, b: any) => a.sortKey - b.sortKey)
      .map((item: any) => {
        const newItem = { ...item };
        delete newItem.sortKey;
        return newItem;
      });
  }

  if (isLoading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
        <XAxis 
          dataKey="name" 
          stroke="var(--muted-foreground)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          dy={10}
        />
        <YAxis 
          stroke="var(--muted-foreground)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `₹${value}`} 
          dx={-10}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            color: 'var(--foreground)',
            fontWeight: 'bold',
            padding: '12px'
          }}
          itemStyle={{ fontWeight: 'bold' }}
          labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
        />
        <Area 
          type="monotone" 
          dataKey="income" 
          name="Income"
          stroke="var(--primary)" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorIncome)" 
          activeDot={{ r: 6, strokeWidth: 0, fill: "var(--primary)" }}
        />
        <Area 
          type="monotone" 
          dataKey="expenses" 
          name="Expenses"
          stroke="var(--destructive)" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorExpenses)" 
          activeDot={{ r: 6, strokeWidth: 0, fill: "var(--destructive)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

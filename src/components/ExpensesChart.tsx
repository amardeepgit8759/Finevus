"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#ef4444", "#eab308", "#3b82f6", "#ec4899", "#8b5cf6", "var(--primary)"];

export function ExpensesChart({ transactions }: { transactions?: any[] }) {

  // Dynamically bucket transactions by category to supply proper data slices to Recharts
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const data = safeTransactions.length > 0
    ? Object.values(safeTransactions.filter(t => t.type === "EXPENSE").reduce((acc, t) => {
        const amount = Number(t.amount) || 0;
        if (!acc[t.category]) acc[t.category] = { name: t.category, value: 0 };
        acc[t.category].value += amount;
        return acc;
      }, {} as Record<string, {name:string, value:number}>)).map((d: any, i) => ({ ...d, color: COLORS[i % COLORS.length] }))
    : [
      { name: "Rent", value: 1200, color: "var(--primary)" },
      { name: "Groceries", value: 400, color: "#3b82f6" },
      { name: "Utilities", value: 150, color: "#f59e0b" },
      { name: "Entertainment", value: 300, color: "var(--destructive)" },
    ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          contentStyle={{ 
            backgroundColor: "var(--card)", 
            borderColor: "rgba(255,255,255,0.1)", 
            borderRadius: "12px", 
            color: "var(--foreground)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
            padding: "12px 16px"
          }}
          itemStyle={{ fontWeight: 500 }}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={6}
          dataKey="value"
          stroke="none"
          cornerRadius={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 8px ${entry.color}40)` }} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

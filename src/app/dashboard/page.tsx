import { Card, CardHeader, CardTitle } from "@/components/Card";
import { DashboardChart } from "@/components/DashboardChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { AIInsightCard } from "@/components/AIInsightCard";
import { DashboardMetrics } from "@/components/DashboardMetrics";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Dashboard</h2>
        <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">Welcome back, here&apos;s your financial overview.</p>
      </div>

      <AIInsightCard />
      
      <DashboardMetrics />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-[450px]">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <div className="h-80 w-full mt-2">
            <DashboardChart />
          </div>
        </Card>
        <Card className="h-[450px]">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <div className="h-80 w-full mt-2 pb-4">
            <RecentTransactions />
          </div>
        </Card>
      </div>
    </div>
  );
}

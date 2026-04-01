import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.isPro) {
      return NextResponse.json({ 
        insight: "AI Insights are a Pro feature. Upgrade your membership to get personalized financial advice!",
        isLocked: true 
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId }
    });
    
    // Summarize data
    let totalIncome = 0;
    const expensesByCategory: Record<string, number> = {};
    
    transactions.forEach((tx: { type: string; amount: number; category: string }) => {
      if (tx.type === "INCOME") {
        totalIncome += tx.amount;
      } else {
        expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
      }
    });

    const promptData = `
Total Income: ${totalIncome}
Expenses by Category:
${Object.entries(expensesByCategory).map(([cat, amt]) => `${cat}: ${amt}`).join('\n')}
`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Graceful fallback for local development if no API key is set yet
      const highestExpense = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
      let mockInsight = "Set your OPENAI_API_KEY in .env to get personalized financial advice!";
      if (highestExpense) {
        mockInsight = `You spent the most on ${highestExpense[0]} (₹${highestExpense[1]}). Try reducing this to reach your savings goals! (Note: Add OPENAI_API_KEY to generate real AI insights.)`;
      }
      return NextResponse.json({ insight: mockInsight });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a top-tier financial advisor. Review the user's categorized spending and income. Provide a single, short, clear, and highly actionable insight (max 2 sentences) focusing on overspending warnings, saving suggestions, or budget advice based directly on their numbers. Respond directly with the insight text."
          },
          {
            role: "user",
            content: promptData
          }
        ],
        temperature: 0.7,
        max_tokens: 60
      })
    });

    if (!response.ok) {
      console.error("OpenAI Error:", await response.text());
      return NextResponse.json({ error: "Failed to fetch from OpenAI" }, { status: 500 });
    }

    const data = await response.json();
    const insight = data.choices[0].message.content.trim();

    return NextResponse.json({ insight });

  } catch (error) {
    console.error("Insight Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

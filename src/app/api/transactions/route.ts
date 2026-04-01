import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { syncUser } from '@/lib/user';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Ensure user exists in our local DB
  const user = await syncUser();
  if (!user) return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });

  try {
    const data = await request.json();
    
    // Explicitly derive userId from Clerk, never from the body
    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: Number(data.amount) || 0,
        category: data.category,
        date: new Date(data.date),
        userId: user.id
      }
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("POST Transaction Error:", error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

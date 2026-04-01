import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { syncUser } from '@/lib/user';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const investments = await prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(investments);
  } catch (error) {
    console.error("GET Investments Error:", error);
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
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
    const investment = await prisma.investment.create({
      data: {
        name: data.name,
        type: data.type,
        quantity: Number(data.quantity) || 0,
        amount: Number(data.amount) || 0,
        userId: user.id
      }
    });
    return NextResponse.json(investment);
  } catch (error) {
    console.error("POST Investment Error:", error);
    return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
  }
}

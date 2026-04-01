import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { syncUser } from '@/lib/user';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Ensure user exists and get their DB status
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await syncUser();
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET User Status Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

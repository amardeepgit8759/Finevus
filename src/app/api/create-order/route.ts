import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getRazorpay } from '@/lib/razorpay';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    console.error("Razorpay instance not created (Missing keys). Returning safe fallback.");
    return NextResponse.json({ error: 'Razorpay not configured' }, { status: 200 });
  }


  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    if (user.isPro) {
      return NextResponse.json({ error: 'User is already a Pro member' }, { status: 400 });
    }

    // Create a Razorpay Order
    // Amount is in the smallest currency unit (paise for INR)
    // ₹499 = 49900 paise
    const options = {
      amount: 49900,
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}

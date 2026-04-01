import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

    const razorpay_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpay_secret) {
      console.error("Razorpay Secret missing during verification.");
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 200 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', razorpay_secret)
      .update(body.toString())
      .digest('hex');


    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await prisma.user.update({
        where: { id: userId },
        data: { isPro: true },
      });

      return NextResponse.json({ 
        message: 'Payment verified successfully. You are now a Pro member!',
        success: true 
      });
    } else {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

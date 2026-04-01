import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const body = await request.json();
    
    // 1. Fetch existing record
    const existing = await prisma.transaction.findUnique({
      where: { id }
    });

    // 2. Check existence (404)
    if (!existing) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // 3. Verify ownership (403)
    if (existing.userId !== userId) {
      return NextResponse.json({ error: 'Access denied: You do not own this record' }, { status: 403 });
    }

    const dataToUpdate: any = {};
    if (body.type !== undefined) dataToUpdate.type = body.type;
    if (body.amount !== undefined) dataToUpdate.amount = Number(body.amount) || 0;
    if (body.category !== undefined) dataToUpdate.category = body.category;
    if (body.date !== undefined) dataToUpdate.date = new Date(body.date);

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("PUT Transaction ID Error:", error);
    return NextResponse.json({ error: 'Internal server error while updating' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // 1. Fetch existing record
    const existing = await prisma.transaction.findUnique({
      where: { id }
    });

    // 2. Check existence (404)
    if (!existing) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // 3. Verify ownership (403)
    if (existing.userId !== userId) {
      return NextResponse.json({ error: 'Access denied: You do not own this record' }, { status: 403 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("DELETE Transaction ID Error:", error);
    return NextResponse.json({ error: 'Internal server error while deleting' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getDemoStore();
  const transaction = store.getTransactionById(id);
  if (!transaction) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: transaction });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const store = getDemoStore();
    const transaction = store.updateTransaction(id, body);
    if (!transaction) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Update transaction error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getDemoStore();
  store.deleteTransaction(id);
  return NextResponse.json({ success: true });
}

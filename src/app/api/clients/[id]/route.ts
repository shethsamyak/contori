import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getDemoStore();
  const client = store.getClientById(id);
  if (!client) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: client });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const store = getDemoStore();
    const client = store.updateClient(id, body);
    if (!client) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getDemoStore();
  store.deleteClient(id);
  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const store = getDemoStore();
    const clients = store.getClients('demo-company-001', searchParams.get('search') || undefined);
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('Clients error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getDemoStore();
    const client = store.createClient({ company_id: 'demo-company-001', ...body });
    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

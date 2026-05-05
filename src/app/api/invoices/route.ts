import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const store = getDemoStore();
    const invoices = store.getInvoices('demo-company-001', {
      status: searchParams.get('status') || undefined,
      client_id: searchParams.get('client_id') || undefined,
      search: searchParams.get('search') || undefined,
    });
    return NextResponse.json({ success: true, data: invoices, total: invoices.length });
  } catch (error) {
    console.error('Invoices error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getDemoStore();
    const invoice = store.createInvoice({ company_id: 'demo-company-001', ...body });
    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

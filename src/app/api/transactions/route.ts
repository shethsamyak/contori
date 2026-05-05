import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const store = getDemoStore();
    const transactions = store.getTransactions('demo-company-001', {
      type: searchParams.get('type') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
    });

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const start = (page - 1) * limit;
    const paged = transactions.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: paged,
      total: transactions.length,
      page,
      limit,
      totalPages: Math.ceil(transactions.length / limit),
    });
  } catch (error) {
    console.error('Transactions error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getDemoStore();
    const transaction = store.createTransaction({ company_id: 'demo-company-001', ...body });
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

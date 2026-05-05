import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET() {
  try {
    const store = getDemoStore();
    const accounts = store.getAccounts('demo-company-001');
    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    console.error('Accounts error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getDemoStore();
    const account = store.createAccount({ company_id: 'demo-company-001', ...body });
    return NextResponse.json({ success: true, data: account }, { status: 201 });
  } catch (error) {
    console.error('Create account error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

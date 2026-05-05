import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const store = getDemoStore();
    const vendors = store.getVendors('demo-company-001', searchParams.get('search') || undefined);
    return NextResponse.json({ success: true, data: vendors });
  } catch (error) {
    console.error('Vendors error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getDemoStore();
    const vendor = store.createVendor({ company_id: 'demo-company-001', ...body });
    return NextResponse.json({ success: true, data: vendor }, { status: 201 });
  } catch (error) {
    console.error('Create vendor error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

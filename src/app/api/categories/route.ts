import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET() {
  try {
    const store = getDemoStore();
    const categories = store.getCategories('demo-company-001');
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getDemoStore();
    const category = store.createCategory({ company_id: 'demo-company-001', ...body });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

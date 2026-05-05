import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET() {
  try {
    const store = getDemoStore();
    const stats = store.getDashboardStats('demo-company-001');
    const monthlyData = store.getMonthlyData('demo-company-001');
    const expenseBreakdown = store.getCategoryBreakdown('demo-company-001', 'expense');
    const incomeBreakdown = store.getCategoryBreakdown('demo-company-001', 'income');
    const recentTransactions = store.getRecentTransactions('demo-company-001', 8);

    return NextResponse.json({
      success: true,
      data: { stats, monthlyData, expenseBreakdown, incomeBreakdown, recentTransactions },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

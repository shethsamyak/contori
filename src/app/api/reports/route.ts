import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'profit_loss';
    const store = getDemoStore();

    const txns = store.getTransactions('demo-company-001');
    const monthlyData = store.getMonthlyData('demo-company-001');
    const incomeBreakdown = store.getCategoryBreakdown('demo-company-001', 'income');
    const expenseBreakdown = store.getCategoryBreakdown('demo-company-001', 'expense');

    if (reportType === 'profit_loss') {
      const totalIncome = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const totalExpenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      return NextResponse.json({
        success: true,
        data: {
          type: 'profit_loss',
          period: 'FY 2025-26',
          totalIncome,
          totalExpenses,
          netProfit: totalIncome - totalExpenses,
          incomeBreakdown,
          expenseBreakdown,
          monthlyData,
        },
      });
    }

    if (reportType === 'balance_sheet') {
      const accounts = store.getAccounts('demo-company-001');
      const totalAssets = accounts.filter(a => a.current_balance > 0).reduce((s, a) => s + a.current_balance, 0);
      const totalLiabilities = accounts.filter(a => a.current_balance < 0).reduce((s, a) => s + Math.abs(a.current_balance), 0);
      const clients = store.getClients('demo-company-001');
      const vendors = store.getVendors('demo-company-001');
      const totalReceivables = clients.reduce((s, c) => s + c.outstanding_amount, 0);
      const totalPayables = vendors.reduce((s, v) => s + v.outstanding_amount, 0);

      return NextResponse.json({
        success: true,
        data: {
          type: 'balance_sheet',
          period: 'As of March 2026',
          assets: {
            bankAccounts: totalAssets,
            accountsReceivable: totalReceivables,
            totalAssets: totalAssets + totalReceivables,
          },
          liabilities: {
            creditCards: totalLiabilities,
            accountsPayable: totalPayables,
            totalLiabilities: totalLiabilities + totalPayables,
          },
          equity: totalAssets + totalReceivables - totalLiabilities - totalPayables,
          accounts: accounts.map(a => ({ name: a.name, type: a.type, balance: a.current_balance })),
        },
      });
    }

    if (reportType === 'cash_flow') {
      const operatingIncome = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const operatingExpenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      return NextResponse.json({
        success: true,
        data: {
          type: 'cash_flow',
          period: 'FY 2025-26',
          operating: { inflows: operatingIncome, outflows: operatingExpenses, net: operatingIncome - operatingExpenses },
          investing: { inflows: 0, outflows: 0, net: 0 },
          financing: { inflows: 0, outflows: 0, net: 0 },
          netCashFlow: operatingIncome - operatingExpenses,
          monthlyData,
        },
      });
    }

    if (reportType === 'tax') {
      const totalIncome = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const totalTaxCollected = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.tax_amount, 0);
      const totalTaxPaid = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.tax_amount, 0);

      return NextResponse.json({
        success: true,
        data: {
          type: 'tax',
          period: 'FY 2025-26',
          totalIncome,
          gstCollected: totalTaxCollected,
          gstPaid: totalTaxPaid,
          netGstPayable: totalTaxCollected - totalTaxPaid,
          gstRate: 18,
          quarters: [
            { quarter: 'Q1 (Apr-Jun)', collected: Math.round(totalTaxCollected * 0.22), paid: Math.round(totalTaxPaid * 0.23) },
            { quarter: 'Q2 (Jul-Sep)', collected: Math.round(totalTaxCollected * 0.25), paid: Math.round(totalTaxPaid * 0.24) },
            { quarter: 'Q3 (Oct-Dec)', collected: Math.round(totalTaxCollected * 0.27), paid: Math.round(totalTaxPaid * 0.26) },
            { quarter: 'Q4 (Jan-Mar)', collected: Math.round(totalTaxCollected * 0.26), paid: Math.round(totalTaxPaid * 0.27) },
          ],
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid report type' }, { status: 400 });
  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

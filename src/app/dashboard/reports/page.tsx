'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';

type ReportType = 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'tax';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('profit_loss');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async (type: ReportType) => {
    setLoading(true);
    const res = await fetch(`/api/reports?type=${type}`);
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchReport(activeReport); }, [activeReport, fetchReport]);

  const reports = [
    { key: 'profit_loss' as ReportType, label: 'Profit & Loss', desc: 'Income vs expenses breakdown' },
    { key: 'balance_sheet' as ReportType, label: 'Balance Sheet', desc: 'Assets, liabilities & equity' },
    { key: 'cash_flow' as ReportType, label: 'Cash Flow', desc: 'Money in and out' },
    { key: 'tax' as ReportType, label: 'GST/Tax Report', desc: 'Tax collected & paid' },
  ];

  const monthChartData = data?.monthlyData?.map((m: any) => ({
    ...m,
    month: m.month.slice(5),
  })) || [];

  const tooltipStyle = { background: '#fff', border: '1px solid #d1e8d9', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1f2f28]">Financial Reports</h1>
        <p className="text-sm text-[#6b7e72] mt-1">Comprehensive financial analytics and insights</p>
      </div>

      {/* Report type tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {reports.map(r => (
          <button
            key={r.key}
            onClick={() => setActiveReport(r.key)}
            className={`p-4 rounded-xl text-left transition-all ${
              activeReport === r.key
                ? 'bg-[#2b5040]/10 border border-[#2b5040]/20 shadow-lg shadow-green-900/5'
                : 'glass-card hover:border-[#a1d9b1]'
            }`}
          >
            <div className={`text-sm font-semibold ${activeReport === r.key ? 'text-[#2b5040]' : 'text-[#1f2f28]'}`}>{r.label}</div>
            <div className="text-xs text-[#6b7e72] mt-0.5">{r.desc}</div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="skeleton h-20 rounded-2xl" />
          <div className="skeleton h-72 rounded-2xl" />
        </div>
      ) : data && (
        <>
          {/* Profit & Loss */}
          {activeReport === 'profit_loss' && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
                  <div className="text-xs text-[#6b7e72] mb-1">Total Income</div>
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(data.totalIncome)}</div>
                  <div className="text-xs text-[#6b7e72] mt-1">{data.period}</div>
                </div>
                <div className="glass-card p-5 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200">
                  <div className="text-xs text-[#6b7e72] mb-1">Total Expenses</div>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(data.totalExpenses)}</div>
                  <div className="text-xs text-[#6b7e72] mt-1">{data.period}</div>
                </div>
                <div className="glass-card p-5 bg-gradient-to-br from-[#e8f5ed] to-[#d1e8d9]/50 border border-[#a1d9b1]">
                  <div className="text-xs text-[#6b7e72] mb-1">Net Profit</div>
                  <div className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-[#2b5040]' : 'text-red-600'}`}>{formatCurrency(data.netProfit)}</div>
                  <div className="text-xs text-[#6b7e72] mt-1">Margin: {data.totalIncome > 0 ? Math.round((data.netProfit / data.totalIncome) * 100) : 0}%</div>
                </div>
              </div>

              {/* Monthly trend */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[#1f2f28] mb-4">Monthly Income vs Expenses</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1e8d9" />
                      <XAxis dataKey="month" tick={{ fill: '#6b7e72', fontSize: 11 }} axisLine={false} />
                      <YAxis tick={{ fill: '#6b7e72', fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatCurrency(Number(v)), '']} />
                      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                      <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category breakdowns side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-[#1f2f28] mb-4">Income by Category</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.incomeBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="amount" strokeWidth={0}>
                          {data.incomeBreakdown?.map((entry: any, idx: number) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatCurrency(Number(v)), '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {data.incomeBreakdown?.map((cat: any) => (
                      <div key={cat.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} /><span className="text-[#1f2f28]">{cat.name}</span></div>
                        <span className="text-[#6b7e72]">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-[#1f2f28] mb-4">Expenses by Category</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.expenseBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="amount" strokeWidth={0}>
                          {data.expenseBreakdown?.map((entry: any, idx: number) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatCurrency(Number(v)), '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {data.expenseBreakdown?.map((cat: any) => (
                      <div key={cat.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} /><span className="text-[#1f2f28]">{cat.name}</span></div>
                        <span className="text-[#6b7e72]">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Balance Sheet */}
          {activeReport === 'balance_sheet' && (
            <div className="space-y-6">
              <div className="glass-card p-5 text-center bg-gradient-to-br from-[#e8f5ed] to-[#d1e8d9]/50 border border-[#a1d9b1]">
                <div className="text-xs text-[#6b7e72]">{data.period}</div>
                <div className="text-3xl font-bold text-[#2b5040] mt-1">Equity: {formatCurrency(data.equity)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assets */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-emerald-600 mb-4">Assets</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-[#1f2f28]">Bank Accounts</span><span className="text-[#1f2f28] font-medium">{formatCurrency(data.assets.bankAccounts)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#1f2f28]">Accounts Receivable</span><span className="text-[#1f2f28] font-medium">{formatCurrency(data.assets.accountsReceivable)}</span></div>
                    <div className="h-px bg-[#d1e8d9] my-2" />
                    <div className="flex justify-between text-sm font-bold"><span className="text-emerald-600">Total Assets</span><span className="text-emerald-600">{formatCurrency(data.assets.totalAssets)}</span></div>
                  </div>
                  {data.accounts && (
                    <div className="mt-4 pt-4 border-t border-[#d1e8d9]">
                      <div className="text-xs text-[#6b7e72] uppercase mb-2">Account Balances</div>
                      {data.accounts.map((acc: any) => (
                        <div key={acc.name} className="flex justify-between text-xs py-1">
                          <span className="text-[#6b7e72]">{acc.name} <span className="text-[#8fa598]">({acc.type})</span></span>
                          <span className={acc.balance >= 0 ? 'text-[#1f2f28]' : 'text-red-600'}>{formatCurrency(acc.balance)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Liabilities */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-red-600 mb-4">Liabilities</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-[#1f2f28]">Credit Cards</span><span className="text-[#1f2f28] font-medium">{formatCurrency(data.liabilities.creditCards)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#1f2f28]">Accounts Payable</span><span className="text-[#1f2f28] font-medium">{formatCurrency(data.liabilities.accountsPayable)}</span></div>
                    <div className="h-px bg-[#d1e8d9] my-2" />
                    <div className="flex justify-between text-sm font-bold"><span className="text-red-600">Total Liabilities</span><span className="text-red-600">{formatCurrency(data.liabilities.totalLiabilities)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cash Flow */}
          {activeReport === 'cash_flow' && (
            <div className="space-y-6">
              <div className="glass-card p-5 text-center bg-gradient-to-br from-emerald-50 to-teal-100/50 border border-emerald-200">
                <div className="text-xs text-[#6b7e72]">{data.period}</div>
                <div className="text-3xl font-bold text-emerald-600 mt-1">Net Cash Flow: {formatCurrency(data.netCashFlow)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Operating', data: data.operating, color: '#2b5040' },
                  { label: 'Investing', data: data.investing, color: '#d97706' },
                  { label: 'Financing', data: data.financing, color: '#7c3aed' },
                ].map(section => (
                  <div key={section.label} className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-[#1f2f28] mb-3">{section.label} Activities</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-[#6b7e72]">Inflows</span><span className="text-emerald-600">{formatCurrency(section.data.inflows)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-[#6b7e72]">Outflows</span><span className="text-red-600">{formatCurrency(section.data.outflows)}</span></div>
                      <div className="h-px bg-[#d1e8d9]" />
                      <div className="flex justify-between text-sm font-bold"><span className="text-[#1f2f28]">Net</span><span className={section.data.net >= 0 ? 'text-emerald-600' : 'text-red-600'}>{formatCurrency(section.data.net)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[#1f2f28] mb-4">Monthly Cash Flow Trend</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthChartData}>
                      <defs>
                        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2b5040" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2b5040" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1e8d9" />
                      <XAxis dataKey="month" tick={{ fill: '#6b7e72', fontSize: 11 }} axisLine={false} />
                      <YAxis tick={{ fill: '#6b7e72', fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatCurrency(Number(v)), 'Net Cash Flow']} />
                      <Area type="monotone" dataKey="profit" stroke="#2b5040" strokeWidth={2} fill="url(#profitGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Tax / GST Report */}
          {activeReport === 'tax' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
                  <div className="text-xs text-[#6b7e72] mb-1">GST Collected (Output)</div>
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(data.gstCollected)}</div>
                </div>
                <div className="glass-card p-5 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200">
                  <div className="text-xs text-[#6b7e72] mb-1">GST Paid (Input)</div>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(data.gstPaid)}</div>
                </div>
                <div className="glass-card p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200">
                  <div className="text-xs text-[#6b7e72] mb-1">Net GST Payable</div>
                  <div className="text-2xl font-bold text-amber-600">{formatCurrency(data.netGstPayable)}</div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[#1f2f28] mb-4">Quarterly GST Summary</h3>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Quarter</th>
                        <th className="text-right">Output GST (Collected)</th>
                        <th className="text-right">Input GST (Paid)</th>
                        <th className="text-right">Net Payable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.quarters?.map((q: any) => (
                        <tr key={q.quarter}>
                          <td className="text-[#1f2f28] font-medium">{q.quarter}</td>
                          <td className="text-right text-emerald-600">{formatCurrency(q.collected)}</td>
                          <td className="text-right text-red-600">{formatCurrency(q.paid)}</td>
                          <td className="text-right text-amber-600 font-semibold">{formatCurrency(q.collected - q.paid)}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-[#d1e8d9]">
                        <td className="font-bold text-[#1f2f28]">Total</td>
                        <td className="text-right font-bold text-emerald-600">{formatCurrency(data.gstCollected)}</td>
                        <td className="text-right font-bold text-red-600">{formatCurrency(data.gstPaid)}</td>
                        <td className="text-right font-bold text-amber-600">{formatCurrency(data.netGstPayable)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="glass-card p-4 bg-[#2b5040]/5 border-[#a1d9b1]">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2b5040]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="text-xs text-[#6b7e72]">
                    <strong className="text-[#1f2f28]">Note:</strong> This is a summary view. For GSTR-1, GSTR-3B filing, please export detailed reports and consult your CA.
                    GST Rate applied: {data.gstRate}%. Figures cover {data.period}.
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

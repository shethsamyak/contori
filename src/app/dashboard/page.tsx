'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatCurrency, formatCurrencyCompact, getMonthName, formatDate, getStatusColor } from '@/lib/utils';
import type { DashboardStats, MonthlyData, CategoryBreakdown, Transaction } from '@/lib/types';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

interface DashboardData {
  stats: DashboardStats;
  monthlyData: MonthlyData[];
  expenseBreakdown: CategoryBreakdown[];
  incomeBreakdown: CategoryBreakdown[];
  recentTransactions: Transaction[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { stats, monthlyData, expenseBreakdown, recentTransactions } = data;

  const chartData = monthlyData.map(m => ({
    ...m,
    month: getMonthName(m.month),
  }));

  const statCards = [
    { label: 'Total Income', value: stats.totalIncome, icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>), color: 'from-emerald-50 to-emerald-100/50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' },
    { label: 'Total Expenses', value: stats.totalExpenses, icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>), color: 'from-red-50 to-red-100/50', textColor: 'text-red-700', borderColor: 'border-red-200' },
    { label: 'Net Profit', value: stats.netProfit, icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>), color: 'from-[#e8f5ed] to-[#d1e8d9]/50', textColor: 'text-[#2b5040]', borderColor: 'border-[#a1d9b1]' },
    { label: 'Cash Balance', value: stats.cashBalance, icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>), color: 'from-amber-50 to-amber-100/50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
  ];

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1f2f28]">Dashboard</h1>
        <p className="text-sm text-[#6b7e72] mt-1">Financial overview for FY 2025-26</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`glass-card p-5 bg-gradient-to-br ${card.color} border ${card.borderColor}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.textColor}`}>{card.icon}</div>
              <span className={`text-xs font-medium ${card.textColor}`}>FY 25-26</span>
            </div>
            <div className={`text-2xl font-bold ${card.textColor}`}>
              {formatCurrencyCompact(card.value)}
            </div>
            <div className="text-xs text-[#6b7e72] mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Invoices', value: stats.pendingInvoices, color: 'text-blue-600' },
          { label: 'Overdue Invoices', value: stats.overdueInvoices, color: 'text-red-600' },
          { label: 'Receivables', value: formatCurrencyCompact(stats.totalReceivables), color: 'text-emerald-600' },
          { label: 'Payables', value: formatCurrencyCompact(stats.totalPayables), color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[#6b7e72] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#1f2f28]">Revenue & Expenses</h3>
              <p className="text-xs text-[#6b7e72] mt-0.5">Monthly breakdown</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1e8d9" />
                <XAxis dataKey="month" tick={{ fill: '#6b7e72', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7e72', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #d1e8d9', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                  labelStyle={{ color: '#6b7e72' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-[#1f2f28] mb-1">Expense Breakdown</h3>
          <p className="text-xs text-[#6b7e72] mb-4">By category</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown.slice(0, 6)}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={75}
                  dataKey="amount" nameKey="name"
                  strokeWidth={0}
                >
                  {expenseBreakdown.slice(0, 6).map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #d1e8d9', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {expenseBreakdown.slice(0, 5).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span className="text-[#1f2f28]">{cat.name}</span>
                </div>
                <span className="text-[#6b7e72]">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit chart + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly profit */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-[#1f2f28] mb-1">Monthly Profit</h3>
          <p className="text-xs text-[#6b7e72] mb-4">Net income trend</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1e8d9" />
                <XAxis dataKey="month" tick={{ fill: '#6b7e72', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7e72', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #d1e8d9', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Profit']}
                />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]} fill="#2b5040" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1f2f28]">Recent Transactions</h3>
              <p className="text-xs text-[#6b7e72] mt-0.5">Latest activity</p>
            </div>
            <a href="/dashboard/transactions" className="text-xs text-[#2b5040] hover:text-[#1e3a2f] font-medium">View All →</a>
          </div>
          <div className="space-y-2">
            {recentTransactions.slice(0, 7).map((txn) => (
              <div key={txn.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f1f9f4] transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${txn.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={txn.type === 'income' ? 'M7 17l9.2-9.2M17 17V7H7' : 'M17 7l-9.2 9.2M7 7v10h10'} /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#1f2f28] truncate">{txn.description}</div>
                  <div className="text-xs text-[#6b7e72]">{txn.category_name} • {formatDate(txn.date)}</div>
                </div>
                <div className={`text-sm font-semibold ${txn.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                </div>
                <span className={`badge ${getStatusColor(txn.status)}`}>{txn.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

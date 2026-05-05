'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import type { Transaction, Category, Account } from '@/lib/types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category_id: '', search: '', status: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    type: 'expense' as string, amount: '', description: '', date: new Date().toISOString().slice(0, 10),
    category_id: '', account_id: '', payment_method: 'bank_transfer', notes: '', tax_amount: '0',
  });
  const [total, setTotal] = useState(0);

  const fetchTransactions = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    params.set('limit', '50');

    const res = await fetch(`/api/transactions?${params}`);
    const json = await res.json();
    if (json.success) {
      setTransactions(json.data);
      setTotal(json.total);
    }
    setLoading(false);
  }, [filters]);

  const fetchMeta = useCallback(async () => {
    const [catRes, accRes] = await Promise.all([fetch('/api/categories'), fetch('/api/accounts')]);
    const [catJson, accJson] = await Promise.all([catRes.json(), accRes.json()]);
    if (catJson.success) setCategories(catJson.data);
    if (accJson.success) setAccounts(accJson.data);
  }, []);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const openNew = () => {
    setEditingTxn(null);
    setForm({ type: 'expense', amount: '', description: '', date: new Date().toISOString().slice(0, 10), category_id: '', account_id: '', payment_method: 'bank_transfer', notes: '', tax_amount: '0' });
    setShowModal(true);
  };

  const openEdit = (txn: Transaction) => {
    setEditingTxn(txn);
    setForm({
      type: txn.type, amount: txn.amount.toString(), description: txn.description || '',
      date: txn.date, category_id: txn.category_id || '', account_id: txn.account_id || '',
      payment_method: txn.payment_method || 'bank_transfer', notes: txn.notes || '',
      tax_amount: txn.tax_amount.toString(),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const body = { ...form, amount: parseFloat(form.amount), tax_amount: parseFloat(form.tax_amount || '0') };
    if (editingTxn) {
      await fetch(`/api/transactions/${editingTxn.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setShowModal(false);
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    fetchTransactions();
  };

  const filteredCategories = form.type ? categories.filter(c => c.type === form.type) : categories;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2f28]">Transactions</h1>
          <p className="text-sm text-[#6b7e72] mt-1">{total} total transactions</p>
        </div>
        <button onClick={openNew} className="btn-primary" id="add-transaction-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" /></svg>
          </div>
          <div><div className="text-xs text-[#6b7e72]">Income</div><div className="text-lg font-bold text-emerald-600">{formatCurrency(totalIncome)}</div></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" /></svg>
          </div>
          <div><div className="text-xs text-[#6b7e72]">Expenses</div><div className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</div></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#e8f5ed] flex items-center justify-center text-[#2b5040]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div><div className="text-xs text-[#6b7e72]">Net</div><div className={`text-lg font-bold ${totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(totalIncome - totalExpenses)}</div></div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text" placeholder="Search transactions..."
            value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input-field max-w-xs" id="txn-search"
          />
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="input-field max-w-[160px]" id="txn-type-filter">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value })} className="input-field max-w-[200px]" id="txn-category-filter">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input-field max-w-[160px]" id="txn-status-filter">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="reconciled">Reconciled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6b7e72]">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-10 h-10 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <div className="text-[#6b7e72]">No transactions found</div>
            <button onClick={openNew} className="btn-primary mt-4">Add your first transaction</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.id}>
                    <td className="text-[#6b7e72] whitespace-nowrap">{formatDate(txn.date)}</td>
                    <td>
                      <div className="text-[#1f2f28] max-w-[200px] truncate">{txn.description}</div>
                      {txn.reference_number && <div className="text-xs text-[#6b7e72]">Ref: {txn.reference_number}</div>}
                    </td>
                    <td className="text-[#1f2f28] text-sm">{txn.category_name || '—'}</td>
                    <td className="text-[#6b7e72] text-sm">{txn.account_name || '—'}</td>
                    <td>
                      <span className={`badge ${txn.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={`text-right font-semibold ${txn.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </td>
                    <td><span className={`badge ${getStatusColor(txn.status)}`}>{txn.status}</span></td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(txn)} className="p-1.5 rounded-lg hover:bg-[#e8f5ed] transition-colors" title="Edit">
                          <svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(txn.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                          <svg className="w-3.5 h-3.5 text-[#6b7e72] hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1f2f28] mb-6">
              {editingTxn ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category_id: '' })} className="input-field" id="txn-form-type">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Amount (₹)</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" placeholder="0.00" required id="txn-form-amount" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6b7e72] mb-1">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" placeholder="What was this for?" id="txn-form-desc" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" id="txn-form-date" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field" id="txn-form-category">
                    <option value="">Select category</option>
                    {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Account</label>
                  <select value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })} className="input-field" id="txn-form-account">
                    <option value="">Select account</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Payment Method</label>
                  <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="input-field" id="txn-form-method">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="card">Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6b7e72] mb-1">Tax Amount (₹)</label>
                <input type="number" value={form.tax_amount} onChange={(e) => setForm({ ...form, tax_amount: e.target.value })} className="input-field" placeholder="0" id="txn-form-tax" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6b7e72] mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} placeholder="Additional notes..." id="txn-form-notes" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary" id="txn-form-save">
                {editingTxn ? 'Update' : 'Create'} Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

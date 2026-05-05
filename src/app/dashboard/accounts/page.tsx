'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils';
import type { Account } from '@/lib/types';

const TypeIcon = ({ type }: { type: string }) => {
  const paths: Record<string, string> = {
    bank: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    cash: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    credit_card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    wallet: 'M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h3.75A2.25 2.25 0 0021 6V5.25A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V12z',
    other: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  };
  return <svg className="w-6 h-6 text-[#2b5040]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={paths[type] || paths.other} /></svg>;
};
const typeColors: Record<string, string> = {
  bank: 'from-blue-50 to-blue-100/50 border-blue-200',
  cash: 'from-emerald-50 to-emerald-100/50 border-emerald-200',
  credit_card: 'from-purple-50 to-purple-100/50 border-purple-200',
  wallet: 'from-amber-50 to-amber-100/50 border-amber-200',
  other: 'from-gray-50 to-gray-100/50 border-gray-200',
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [form, setForm] = useState({
    name: '', type: 'bank', account_number: '', bank_name: '',
    ifsc_code: '', opening_balance: '0', currency: 'INR',
  });

  const fetchAccounts = useCallback(async () => {
    const res = await fetch('/api/accounts');
    const json = await res.json();
    if (json.success) setAccounts(json.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const openNew = () => {
    setEditingAccount(null);
    setForm({ name: '', type: 'bank', account_number: '', bank_name: '', ifsc_code: '', opening_balance: '0', currency: 'INR' });
    setShowModal(true);
  };

  const openEdit = (acc: Account) => {
    setEditingAccount(acc);
    setForm({
      name: acc.name, type: acc.type, account_number: acc.account_number || '',
      bank_name: acc.bank_name || '', ifsc_code: acc.ifsc_code || '',
      opening_balance: acc.opening_balance.toString(), currency: acc.currency,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const body = { ...form, opening_balance: parseFloat(form.opening_balance || '0'), current_balance: parseFloat(form.opening_balance || '0') };
    if (editingAccount) {
      await fetch(`/api/accounts/${editingAccount.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setShowModal(false);
    fetchAccounts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this account?')) return;
    await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
    fetchAccounts();
  };

  const totalBalance = accounts.reduce((s, a) => s + a.current_balance, 0);
  const bankBalance = accounts.filter(a => a.type === 'bank').reduce((s, a) => s + a.current_balance, 0);
  const cashBalance = accounts.filter(a => a.type === 'cash').reduce((s, a) => s + a.current_balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2f28]">Accounts</h1>
          <p className="text-sm text-[#6b7e72] mt-1">{accounts.length} accounts</p>
        </div>
        <button onClick={openNew} className="btn-primary" id="add-account-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Account
        </button>
      </div>

      {/* Balance summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 bg-gradient-to-br from-[#e8f5ed] to-[#d1e8d9]/50 border border-[#a1d9b1]">
          <div className="text-xs text-[#6b7e72] mb-1">Total Balance</div>
          <div className="text-2xl font-bold text-[#2b5040]">{formatCurrency(totalBalance)}</div>
        </div>
        <div className="glass-card p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
          <div className="text-xs text-[#6b7e72] mb-1">Bank Accounts</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(bankBalance)}</div>
        </div>
        <div className="glass-card p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
          <div className="text-xs text-[#6b7e72] mb-1">Cash on Hand</div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(cashBalance)}</div>
        </div>
      </div>

      {/* Account cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-[#6b7e72] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <div className="text-[#6b7e72] mb-4">No accounts yet</div>
          <button onClick={openNew} className="btn-primary">Add your first account</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map(acc => (
            <div key={acc.id} className={`glass-card p-5 bg-gradient-to-br ${typeColors[acc.type] || typeColors.other}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TypeIcon type={acc.type} />
                  <div>
                    <div className="text-sm font-semibold text-[#1f2f28]">{acc.name}</div>
                    <div className="text-xs text-[#6b7e72] capitalize">{acc.type.replace('_', ' ')}</div>
                  </div>
                </div>
                <span className={`badge ${acc.is_active ? 'badge-success' : 'badge-neutral'}`}>
                  {acc.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-[#6b7e72] uppercase">Current Balance</div>
                  <div className={`text-lg font-bold ${acc.current_balance >= 0 ? 'text-[#1f2f28]' : 'text-red-600'}`}>
                    {formatCurrency(acc.current_balance)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6b7e72] uppercase">Opening Balance</div>
                  <div className="text-sm text-[#1f2f28]">{formatCurrency(acc.opening_balance)}</div>
                </div>
              </div>

              {(acc.account_number || acc.bank_name) && (
                <div className="space-y-1 mb-4">
                  {acc.bank_name && <div className="text-xs text-[#6b7e72] flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg> {acc.bank_name}</div>}
                  {acc.account_number && <div className="text-xs text-[#6b7e72] flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> {acc.account_number}</div>}
                  {acc.ifsc_code && <div className="text-xs text-[#6b7e72] flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> IFSC: {acc.ifsc_code}</div>}
                </div>
              )}

              <div className="flex justify-end gap-1 pt-3 border-t border-black/5">
                <button onClick={() => openEdit(acc)} className="p-2 rounded-lg hover:bg-white/50 transition-colors" title="Edit">
                  <svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(acc.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                  <svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1f2f28] mb-6">{editingAccount ? 'Edit Account' : 'New Account'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#6b7e72] mb-1">Account Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. HDFC Business Account" required id="acc-form-name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field" id="acc-form-type">
                    <option value="bank">Bank Account</option>
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="wallet">Wallet</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Opening Balance (₹)</label>
                  <input type="number" value={form.opening_balance} onChange={(e) => setForm({ ...form, opening_balance: e.target.value })} className="input-field" id="acc-form-balance" />
                </div>
              </div>
              {(form.type === 'bank' || form.type === 'credit_card') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#6b7e72] mb-1">Bank Name</label>
                      <input type="text" value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} className="input-field" id="acc-form-bank" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6b7e72] mb-1">Account Number</label>
                      <input type="text" value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} className="input-field" id="acc-form-number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b7e72] mb-1">IFSC Code</label>
                    <input type="text" value={form.ifsc_code} onChange={(e) => setForm({ ...form, ifsc_code: e.target.value })} className="input-field" id="acc-form-ifsc" />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary" id="acc-form-save">{editingAccount ? 'Update' : 'Create'} Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

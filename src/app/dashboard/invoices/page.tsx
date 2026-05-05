'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatCurrency, formatDate, getStatusColor, generateInvoiceNumber } from '@/lib/utils';
import type { Invoice, Client } from '@/lib/types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    invoice_number: '', client_id: '', issue_date: new Date().toISOString().slice(0, 10),
    due_date: '', subtotal: '', tax_rate: '18', discount_amount: '0', notes: '', terms: 'Payment due within 30 days.',
  });

  const fetchInvoices = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    const res = await fetch(`/api/invoices?${params}`);
    const json = await res.json();
    if (json.success) setInvoices(json.data);
    setLoading(false);
  }, [filters]);

  const fetchClients = useCallback(async () => {
    const res = await fetch('/api/clients');
    const json = await res.json();
    if (json.success) setClients(json.data);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);
  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const openNew = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    setForm({
      invoice_number: generateInvoiceNumber(), client_id: '',
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: dueDate.toISOString().slice(0, 10),
      subtotal: '', tax_rate: '18', discount_amount: '0',
      notes: '', terms: 'Payment due within 30 days.',
    });
    setShowModal(true);
  };

  const handleCreate = async () => {
    const subtotal = parseFloat(form.subtotal || '0');
    const taxRate = parseFloat(form.tax_rate || '0');
    const discount = parseFloat(form.discount_amount || '0');
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount - discount;

    await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form, subtotal, tax_rate: taxRate, tax_amount: taxAmount,
        discount_amount: discount, total, status: 'draft',
      }),
    });
    setShowModal(false);
    fetchInvoices();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchInvoices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    fetchInvoices();
  };

  const statusCounts = {
    all: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
  };

  const totalOutstanding = invoices
    .filter(i => ['sent', 'partially_paid', 'overdue'].includes(i.status))
    .reduce((s, i) => s + (i.total - i.amount_paid), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2f28]">Invoices</h1>
          <p className="text-sm text-[#6b7e72] mt-1">Outstanding: {formatCurrency(totalOutstanding)}</p>
        </div>
        <button onClick={openNew} className="btn-primary" id="create-invoice-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Invoice
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: '', label: 'All', count: statusCounts.all },
          { key: 'draft', label: 'Draft', count: statusCounts.draft },
          { key: 'sent', label: 'Sent', count: statusCounts.sent },
          { key: 'paid', label: 'Paid', count: statusCounts.paid },
          { key: 'overdue', label: 'Overdue', count: statusCounts.overdue },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilters({ ...filters, status: tab.key })}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filters.status === tab.key
                ? 'bg-[#2b5040]/10 text-[#2b5040] border border-[#2b5040]/20'
                : 'bg-white text-[#6b7e72] border border-[#d1e8d9] hover:bg-[#f1f9f4]'
            }`}
          >
            {tab.label} <span className="text-xs opacity-60 ml-1">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text" placeholder="Search invoices..."
        value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="input-field max-w-sm" id="invoice-search"
      />

      {/* Invoice cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : invoices.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-[#6b7e72] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <div className="text-[#6b7e72] mb-4">No invoices found</div>
          <button onClick={openNew} className="btn-primary">Create your first invoice</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoices.map(inv => (
            <div key={inv.id} className="glass-card p-5 hover:border-[#a1d9b1]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm font-bold text-[#1f2f28]">{inv.invoice_number}</div>
                  <div className="text-xs text-[#6b7e72] mt-0.5">{inv.client_name}</div>
                </div>
                <span className={`badge ${getStatusColor(inv.status)}`}>{inv.status.replace('_', ' ')}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-[10px] text-[#6b7e72] uppercase">Issued</div>
                  <div className="text-xs text-[#1f2f28]">{formatDate(inv.issue_date)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6b7e72] uppercase">Due</div>
                  <div className="text-xs text-[#1f2f28]">{formatDate(inv.due_date)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6b7e72] uppercase">Total</div>
                  <div className="text-sm font-bold text-[#1f2f28]">{formatCurrency(inv.total)}</div>
                </div>
              </div>
              {inv.amount_paid > 0 && inv.status !== 'paid' && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[#6b7e72] mb-1">
                    <span>Paid: {formatCurrency(inv.amount_paid)}</span>
                    <span>Due: {formatCurrency(inv.total - inv.amount_paid)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#e8f5ed]">
                    <div className="h-full rounded-full bg-[#2b5040]" style={{ width: `${(inv.amount_paid / inv.total) * 100}%` }} />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t border-[#d1e8d9]">
                {inv.status === 'draft' && (
                  <button onClick={() => updateStatus(inv.id, 'sent')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark Sent</button>
                )}
                {(inv.status === 'sent' || inv.status === 'overdue') && (
                  <button onClick={() => updateStatus(inv.id, 'paid')} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Mark Paid</button>
                )}
                <div className="flex-1" />
                <button onClick={() => handleDelete(inv.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1f2f28] mb-6">Create Invoice</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Invoice Number</label>
                  <input type="text" value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} className="input-field" id="inv-form-number" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Client</label>
                  <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="input-field" id="inv-form-client">
                    <option value="">Select client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Issue Date</label>
                  <input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className="input-field" id="inv-form-issue" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Due Date</label>
                  <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="input-field" id="inv-form-due" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Subtotal (₹)</label>
                  <input type="number" value={form.subtotal} onChange={(e) => setForm({ ...form, subtotal: e.target.value })} className="input-field" placeholder="0" id="inv-form-subtotal" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Tax Rate (%)</label>
                  <input type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} className="input-field" id="inv-form-tax" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b7e72] mb-1">Discount (₹)</label>
                  <input type="number" value={form.discount_amount} onChange={(e) => setForm({ ...form, discount_amount: e.target.value })} className="input-field" id="inv-form-discount" />
                </div>
              </div>
              {form.subtotal && (
                <div className="p-3 rounded-xl bg-[#2b5040]/8 border border-[#2b5040]/15">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7e72]">Total:</span>
                    <span className="text-[#1f2f28] font-bold">
                      {formatCurrency(
                        parseFloat(form.subtotal || '0') * (1 + parseFloat(form.tax_rate || '0') / 100) - parseFloat(form.discount_amount || '0')
                      )}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-[#6b7e72] mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} placeholder="Invoice notes..." id="inv-form-notes" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreate} className="btn-primary" id="inv-form-save">Create Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

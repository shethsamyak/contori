'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatCurrency, getInitials } from '@/lib/utils';
import type { Client } from '@/lib/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', gstin: '', pan: '',
    billing_address: '', city: '', state: '', postal_code: '', notes: '',
  });

  const fetchClients = useCallback(async () => {
    const params = search ? `?search=${search}` : '';
    const res = await fetch(`/api/clients${params}`);
    const json = await res.json();
    if (json.success) setClients(json.data);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const openNew = () => {
    setEditingClient(null);
    setForm({ name: '', email: '', phone: '', gstin: '', pan: '', billing_address: '', city: '', state: '', postal_code: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setForm({
      name: client.name, email: client.email || '', phone: client.phone || '',
      gstin: client.gstin || '', pan: client.pan || '', billing_address: client.billing_address || '',
      city: client.city || '', state: client.state || '', postal_code: client.postal_code || '',
      notes: client.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingClient) {
      await fetch(`/api/clients/${editingClient.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    fetchClients();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return;
    await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    fetchClients();
  };

  const totalOutstanding = clients.reduce((s, c) => s + c.outstanding_amount, 0);
  const colors = ['from-[#2b5040] to-[#3a6b55]', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-500', 'from-blue-500 to-cyan-600', 'from-rose-400 to-pink-500'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2f28]">Clients</h1>
          <p className="text-sm text-[#6b7e72] mt-1">{clients.length} clients • Outstanding: {formatCurrency(totalOutstanding)}</p>
        </div>
        <button onClick={openNew} className="btn-primary" id="add-client-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Client
        </button>
      </div>

      <input type="text" placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field max-w-sm" id="client-search" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
        </div>
      ) : clients.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-[#6b7e72] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <div className="text-[#6b7e72] mb-4">No clients yet</div>
          <button onClick={openNew} className="btn-primary">Add your first client</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, idx) => (
            <div key={client.id} className="glass-card p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                  {getInitials(client.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1f2f28] truncate">{client.name}</div>
                  {client.email && <div className="text-xs text-[#6b7e72] truncate">{client.email}</div>}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {client.phone && (
                  <div className="flex items-center gap-2 text-xs text-[#6b7e72]">
                    <svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><span>{client.phone}</span>
                  </div>
                )}
                {client.city && (
                  <div className="flex items-center gap-2 text-xs text-[#6b7e72]">
                    <svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span>{client.city}{client.state ? `, ${client.state}` : ''}</span>
                  </div>
                )}
                {client.gstin && (
                  <div className="flex items-center gap-2 text-xs text-[#6b7e72]">
                    <svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg><span>GSTIN: {client.gstin}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#d1e8d9]">
                <div>
                  <div className="text-[10px] text-[#6b7e72] uppercase">Outstanding</div>
                  <div className={`text-sm font-bold ${client.outstanding_amount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {formatCurrency(client.outstanding_amount)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(client)} className="p-2 rounded-lg hover:bg-[#e8f5ed] transition-colors" title="Edit">
                    <svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(client.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                    <svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1f2f28] mb-6">{editingClient ? 'Edit Client' : 'New Client'}</h2>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required id="client-form-name" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" id="client-form-email" /></div>
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" id="client-form-phone" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">GSTIN</label><input type="text" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className="input-field" id="client-form-gstin" /></div>
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">PAN</label><input type="text" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} className="input-field" id="client-form-pan" /></div>
              </div>
              <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Billing Address</label><textarea value={form.billing_address} onChange={(e) => setForm({ ...form, billing_address: e.target.value })} className="input-field" rows={2} id="client-form-address" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">City</label><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" id="client-form-city" /></div>
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">State</label><input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" id="client-form-state" /></div>
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Postal Code</label><input type="text" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="input-field" id="client-form-postal" /></div>
              </div>
              <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} id="client-form-notes" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary" id="client-form-save">{editingClient ? 'Update' : 'Create'} Client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

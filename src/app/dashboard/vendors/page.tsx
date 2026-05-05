'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatCurrency, getInitials } from '@/lib/utils';
import type { Vendor } from '@/lib/types';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', gstin: '', pan: '',
    address: '', city: '', state: '', postal_code: '', notes: '',
  });

  const fetchVendors = useCallback(async () => {
    const params = search ? `?search=${search}` : '';
    const res = await fetch(`/api/vendors${params}`);
    const json = await res.json();
    if (json.success) setVendors(json.data);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const openNew = () => {
    setEditingVendor(null);
    setForm({ name: '', email: '', phone: '', gstin: '', pan: '', address: '', city: '', state: '', postal_code: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setForm({
      name: vendor.name, email: vendor.email || '', phone: vendor.phone || '',
      gstin: vendor.gstin || '', pan: vendor.pan || '', address: vendor.address || '',
      city: vendor.city || '', state: vendor.state || '', postal_code: vendor.postal_code || '',
      notes: vendor.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingVendor) {
      await fetch(`/api/vendors/${editingVendor.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/vendors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    fetchVendors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vendor?')) return;
    await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
    fetchVendors();
  };

  const totalPayable = vendors.reduce((s, v) => s + v.outstanding_amount, 0);
  const colors = ['from-[#2b5040] to-[#3a6b55]', 'from-teal-500 to-emerald-500', 'from-blue-500 to-cyan-600', 'from-amber-500 to-orange-500'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2f28]">Vendors</h1>
          <p className="text-sm text-[#6b7e72] mt-1">{vendors.length} vendors • Payable: {formatCurrency(totalPayable)}</p>
        </div>
        <button onClick={openNew} className="btn-primary" id="add-vendor-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Vendor
        </button>
      </div>

      <input type="text" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field max-w-sm" id="vendor-search" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
        </div>
      ) : vendors.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-[#6b7e72] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          <div className="text-[#6b7e72] mb-4">No vendors yet</div>
          <button onClick={openNew} className="btn-primary">Add your first vendor</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor, idx) => (
            <div key={vendor.id} className="glass-card p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                  {getInitials(vendor.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1f2f28] truncate">{vendor.name}</div>
                  {vendor.email && <div className="text-xs text-[#6b7e72] truncate">{vendor.email}</div>}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {vendor.phone && <div className="flex items-center gap-2 text-xs text-[#6b7e72]"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><span>{vendor.phone}</span></div>}
                {vendor.city && <div className="flex items-center gap-2 text-xs text-[#6b7e72]"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span>{vendor.city}{vendor.state ? `, ${vendor.state}` : ''}</span></div>}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#d1e8d9]">
                <div>
                  <div className="text-[10px] text-[#6b7e72] uppercase">Payable</div>
                  <div className={`text-sm font-bold ${vendor.outstanding_amount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {formatCurrency(vendor.outstanding_amount)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(vendor)} className="p-2 rounded-lg hover:bg-[#e8f5ed] transition-colors"><svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  <button onClick={() => handleDelete(vendor.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors"><svg className="w-3.5 h-3.5 text-[#6b7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1f2f28] mb-6">{editingVendor ? 'Edit Vendor' : 'New Vendor'}</h2>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required id="vendor-form-name" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" id="vendor-form-email" /></div>
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" id="vendor-form-phone" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">GSTIN</label><input type="text" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className="input-field" id="vendor-form-gstin" /></div>
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">PAN</label><input type="text" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} className="input-field" id="vendor-form-pan" /></div>
              </div>
              <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Address</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" rows={2} id="vendor-form-address" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">City</label><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">State</label><input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-[#6b7e72] mb-1">Postal</label><input type="text" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="input-field" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary" id="vendor-form-save">{editingVendor ? 'Update' : 'Create'} Vendor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

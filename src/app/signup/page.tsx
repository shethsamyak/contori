'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', company_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signup(form);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-50 via-[#f1f9f4] to-green-100">
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-green-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-emerald-200/25 rounded-full blur-[80px]" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-16">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/main-logo.png" alt="Contori Logo" width={340} height={94} priority className="site-logo" style={{ height: '80px', width: 'auto' }} />
          </div>
          <h2 className="text-4xl font-bold text-[#1f2f28] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Start your free
            <br />
            <span className="gradient-text">14-day trial</span>
          </h2>
          <p className="mt-4 text-[#6b7e72] text-lg">No credit card required. Set up your business in minutes.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              'Dashboard Analytics',
              'Invoice Builder',
              'Financial Reports',
              'GST/Tax Ready',
              'Client Management',
              'Auto Reconciliation',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-[#1f2f28] text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2b5040]" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/main-logo.png" alt="Contori Logo" width={280} height={78} className="site-logo" style={{ height: '64px', width: 'auto' }} />
          </div>

          <h1 className="text-2xl font-bold text-[#1f2f28]">Create your account</h1>
          <p className="mt-2 text-[#6b7e72] text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-[#2b5040] hover:text-[#1e3a2f] font-medium">Sign in</a>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1f2f28] mb-1.5">Full Name</label>
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" placeholder="Arjun Kapoor" required id="signup-name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1f2f28] mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@company.com" required id="signup-email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1f2f28] mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Min. 6 characters" required id="signup-password" minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1f2f28] mb-1.5">Company Name</label>
              <input type="text" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="input-field" placeholder="Kapoor Enterprises" id="signup-company" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50" id="signup-submit">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>

            <p className="text-xs text-[#6b7e72] text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

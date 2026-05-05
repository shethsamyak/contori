'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('demo@countori.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-50 via-[#f1f9f4] to-green-100">
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-green-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-emerald-200/25 rounded-full blur-[80px]" />
      </div>

      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-16">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/main-logo.png" alt="Contori Logo" width={340} height={94} priority className="site-logo" style={{ height: '80px', width: 'auto' }} />
          </div>
          <h2 className="text-4xl font-bold text-[#1f2f28] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back to
            <br />
            <span className="gradient-text">smarter bookkeeping</span>
          </h2>
          <p className="mt-4 text-[#6b7e72] text-lg">
            Track every rupee, automate your accounting, and make informed financial decisions.
          </p>
          <div className="mt-12 space-y-4">
            {['Multi-company management', 'GST-ready tax reports', 'Smart invoicing & payments'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-[#1f2f28]">
                <div className="w-5 h-5 rounded-full bg-[#a1d9b1]/40 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#2b5040]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/main-logo.png" alt="Contori Logo" width={280} height={78} className="site-logo" style={{ height: '64px', width: 'auto' }} />
          </div>

          <h1 className="text-2xl font-bold text-[#1f2f28]">Sign in to your account</h1>
          <p className="mt-2 text-[#6b7e72] text-sm">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-[#2b5040] hover:text-[#1e3a2f] font-medium">Create one free</a>
          </p>

          {/* Demo notice */}
          <div className="mt-6 p-3 rounded-xl bg-[#2b5040]/8 border border-[#2b5040]/15">
            <p className="text-xs text-[#2b5040]">
              <strong>Demo Mode:</strong> Use <code className="bg-[#a1d9b1]/30 px-1 rounded">demo@countori.com</code> / <code className="bg-[#a1d9b1]/30 px-1 rounded">demo123</code> to explore
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1f2f28] mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@company.com"
                required
                id="login-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2f28] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                id="login-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50"
              id="login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

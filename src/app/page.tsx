'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-[#f1f9f4] to-green-100" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-green-200/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center">
          <Image src="/main-logo.png" alt="Contori Logo" width={300} height={82} priority className="site-logo" style={{ height: '70px', width: 'auto' }} />
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-sm font-medium text-[#6b7e72] hover:text-[#2b5040] transition-colors px-4 py-2">
            Log In
          </a>
          <a href="/signup" className="btn-primary text-sm">
            Get a Quote
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s', fontFamily: "'Playfair Display', serif" }}>
          <span className="text-[#1f2f28]">Where Every</span>
          <br />
          <span className="gradient-text">Digit Matters</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[#6b7e72] max-w-2xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Professional bookkeeping services tailored to your business needs.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <a href="/signup" className="btn-primary px-8 py-3 text-base rounded-xl shadow-lg shadow-green-900/15 hover:shadow-green-900/25 transition-all">
            Get Started Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </div>
      </section>

      {/* WHY COUNTORI */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#2b5040] mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>WHY COUNTORI?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: 'Trusted Expertise',
                desc: 'Certified bookkeepers with deep knowledge to keep your business compliant and stress-free.',
                icon: (
                  <svg className="w-10 h-10 text-[#2b5040]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                ),
              },
              {
                title: 'Custom Solutions',
                desc: 'Tailored services to meet the specific financial and reporting needs of your business.',
                icon: (
                  <svg className="w-10 h-10 text-[#2b5040]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                ),
              },
              {
                title: 'Data Security',
                desc: 'Advanced security protocols ensure your financial info stays confidential and protected.',
                icon: (
                  <svg className="w-10 h-10 text-[#2b5040]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" />
                  </svg>
                ),
              },
              {
                title: 'On-Time Reporting',
                desc: 'Stay ahead with timely, clear financial reports that help you make confident decisions.',
                icon: (
                  <svg className="w-10 h-10 text-[#2b5040]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="glass-card p-8 flex flex-col items-center text-center hover:shadow-lg transition-all animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#a1d9b1]/30 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1f2f28] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6b7e72] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="relative z-10 py-16 px-6 bg-gradient-to-r from-green-50 to-green-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#2b5040] mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>Our Services</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Monthly Bookkeeping',
                desc: 'Accurate records every month for peace of mind and smart decisions.',
                icon: (
                  <svg className="w-10 h-10 text-[#2b5040]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                title: 'Accounts Payable & Receivable',
                desc: 'Track your invoices, manage dues, and stay in control of cash flow.',
                icon: (
                  <svg className="w-10 h-10 text-[#2b5040]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Financial Reporting & Review',
                desc: 'Clear insights through monthly reports, KPIs, and performance snapshots.',
                icon: (
                  <svg className="w-10 h-10 text-[#2b5040]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
            ].map((service) => (
              <div key={service.title} className="glass-card p-6 text-center hover:shadow-lg transition-all">
                <div className="mx-auto w-20 h-20 mb-4 bg-[#a1d9b1]/30 rounded-full flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1f2f28]">{service.title}</h3>
                <p className="text-sm text-[#6b7e72] mt-2 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 px-6 bg-[#2b5040] text-white text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Ready to Simplify Your Bookkeeping?
        </h2>
        <p className="max-w-xl mx-auto mb-8 text-lg text-white/80">
          Let COUNTORI handle your finances so you can focus on growing your business.
        </p>
        <a
          href="/signup"
          className="inline-block bg-[#a1d9b1] text-[#2b5040] font-semibold px-8 py-4 rounded-lg hover:bg-green-300 transition text-lg"
        >
          Contact Us
        </a>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 bg-gray-800 text-white">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Image src="/main-logo.png" alt="Contori Logo" width={200} height={55} className="site-logo-footer" style={{ height: '42px', width: 'auto' }} />
        </div>
        <p className="text-sm">&copy; 2026 COUNTORI. All rights reserved.</p>
      </footer>
    </div>
  );
}

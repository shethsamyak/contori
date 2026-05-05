import Link from 'next/link';
import Image from 'next/image';

/**
 * COUNTORI — Custom 404 Error Page
 * ============================================================
 * Displayed when a user navigates to a route that does not exist.
 * Satisfies Lab 8 Requirement 3: Custom error handling.
 * ============================================================
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f9f4] px-6">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-green-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-200/15 rounded-full blur-[80px]" />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Image src="/main-logo.png" alt="Contori Logo" width={300} height={82} priority className="site-logo" style={{ height: '70px', width: 'auto' }} />
      </div>

      {/* Error content */}
      <div className="text-center max-w-md">
        <h1
          className="text-8xl font-bold gradient-text mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          404
        </h1>
        <h2 className="text-2xl font-semibold text-[#1f2f28] mb-3">
          Page Not Found
        </h2>
        <p className="text-[#6b7e72] mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
          Please check the URL and try again.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary px-6 py-3 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary px-6 py-3 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </Link>
        </div>
      </div>

      {/* Helpful info */}
      <div className="mt-12 glass-card p-4 max-w-sm text-center">
        <p className="text-xs text-[#6b7e72]">
          <strong className="text-[#1f2f28]">Available routes:</strong>{' '}
          <Link href="/" className="text-[#2b5040] hover:underline">/home</Link>{' · '}
          <Link href="/login" className="text-[#2b5040] hover:underline">/login</Link>{' · '}
          <Link href="/signup" className="text-[#2b5040] hover:underline">/signup</Link>{' · '}
          <Link href="/dashboard" className="text-[#2b5040] hover:underline">/dashboard</Link>
        </p>
      </div>
    </div>
  );
}

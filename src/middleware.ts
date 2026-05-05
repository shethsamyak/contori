import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * COUNTORI — Custom Middleware
 * ============================================================
 * Runs BEFORE every request is processed.
 * Demonstrates request logging, timing, and post-processing.
 * ============================================================
 */
export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { method, url } = request;
  const pathname = request.nextUrl.pathname;

  // ──────────────────────────────────────────────
  // [BEFORE] Request Processing — Log incoming request
  // ──────────────────────────────────────────────
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`[MIDDLEWARE — BEFORE] Incoming Request`);
  console.log(`  Method   : ${method}`);
  console.log(`  Path     : ${pathname}`);
  console.log(`  URL      : ${url}`);
  console.log(`  Time     : ${new Date().toISOString()}`);
  console.log(`  User-Agent: ${request.headers.get('user-agent')?.slice(0, 80) || 'N/A'}`);
  console.log(`${'─'.repeat(60)}`);

  // Let the request proceed and get the response
  const response = NextResponse.next();

  // ──────────────────────────────────────────────
  // [AFTER] Response Generated — Log post-processing
  // ──────────────────────────────────────────────
  const duration = Date.now() - startTime;
  console.log(`[MIDDLEWARE — AFTER] Response Generated`);
  console.log(`  Path     : ${pathname}`);
  console.log(`  Duration : ${duration}ms`);
  console.log(`  Status   : ${response.status}`);
  console.log(`${'═'.repeat(60)}\n`);

  // Add custom headers to demonstrate middleware modification
  response.headers.set('X-Countori-Middleware', 'active');
  response.headers.set('X-Request-Duration', `${duration}ms`);
  response.headers.set('X-Processed-At', new Date().toISOString());

  return response;
}

// Configure which routes the middleware applies to
// (skip static files, images, and favicon)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

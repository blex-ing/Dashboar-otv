import { demoCatalog } from '../shared/catalog.ts';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "connect-src 'self'",
  "font-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'"
].join('; ');

/** These are set on both API and HTML/static assets, including error responses. */
function securityHeaders(headers: Headers, secure: boolean): void {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Content-Security-Policy', CSP);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (secure) headers.set('Strict-Transport-Security', 'max-age=31536000');
}

/** Requests are isolated by path and method; no writable endpoint is exposed. */
function apiResponse(request: Request, pathname: string): Response {
  const headers = { 'Cache-Control': 'no-store' };
  if (pathname === '/api/votes') {
    return Response.json({
      error: 'VOTING_NOT_ENABLED',
      message: 'La votación todavía no está habilitada.'
    }, { status: 503, headers });
  }
  if (pathname === '/api/health' || pathname === '/api/public/catalog') {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return Response.json({ error: 'METHOD_NOT_ALLOWED' }, {
        status: 405, headers: { ...headers, Allow: 'GET, HEAD' }
      });
    }
    const response = pathname === '/api/health'
      ? Response.json({ status: 'ok', version: '0.3.5', voting: 'disabled' }, { headers })
      : Response.json(demoCatalog, { headers });
    return request.method === 'HEAD'
      ? new Response(null, { status: response.status, headers: response.headers })
      : response;
  }
  return Response.json({ error: 'NOT_FOUND' }, { status: 404, headers });
}

/** Avoid caching HTML and unknown assets; fingerprinted builds are immutable. */
function assetCacheControl(pathname: string, status: number): string {
  if (status !== 200 && status !== 304) return 'no-store';
  if (/^\/assets\/[a-zA-Z0-9_-]+-[A-Z0-9]{8}(?:\.[a-zA-Z0-9]+)+$/.test(pathname)) {
    return 'public, max-age=31536000, immutable';
  }
  return 'no-cache';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const response = url.pathname.startsWith('/api/')
      ? apiResponse(request, url.pathname)
      : await env.ASSETS.fetch(request);
    // Copy the headers rather than mutating Cloudflare's immutable Response.
    const headers = new Headers(response.headers);
    securityHeaders(headers, url.protocol === 'https:');
    headers.set('Cache-Control', url.pathname.startsWith('/api/')
      ? 'no-store'
      : assetCacheControl(url.pathname, response.status));
    return new Response(request.method === 'HEAD' ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};

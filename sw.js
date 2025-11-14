// sw.js (put at root)
// Full hide proxy: intercept /sooka-mpd and /sooka-proxy
// IMPORTANT: keep this file at root so scope covers site pages.

importScripts('/config.js'); // loads self.SOOKA_TOKEN — DO NOT hardcode token here in chat

const SOOKA_HOST_PART = 'sooka.my'; // match origin hostname substring
const PROXY_MPD_PATH = '/sooka-mpd';   // Shaka will request this
const PROXY_GENERIC = '/sooka-proxy'; // Shaka will request segments/keys here

self.addEventListener('install', event => {
  // activate immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

function allowedOrigin(hostname) {
  return hostname.includes(SOOKA_HOST_PART);
}

async function forwardFetchWithAuth(url, req) {
  // Build headers forwarding Range, User-Agent-like, Accept, Referer, Origin if present from client
  const headers = new Headers();
  const clientUA = req.headers.get('user-agent') || 'Mozilla/5.0';
  headers.set('User-Agent', clientUA);
  const range = req.headers.get('range');
  if (range) headers.set('Range', range);
  const accept = req.headers.get('accept'); if (accept) headers.set('Accept', accept);
  const referer = req.headers.get('referer'); if (referer) headers.set('Referer', referer);
  const origin = req.headers.get('origin'); if (origin) headers.set('Origin', origin);

  // Add Authorization from config (kept inside SW)
  if (!self.SOOKA_TOKEN) {
    return new Response('Missing token inside service worker config', { status: 500 });
  }
  headers.set('Authorization', 'Bearer ' + self.SOOKA_TOKEN);

  // fetch upstream
  const upstreamRes = await fetch(url, {
    method: req.method,
    headers: headers,
    redirect: 'follow'
  });

  // Clone headers except hop-by-hop
  const resHeaders = new Headers();
  upstreamRes.headers.forEach((v, k) => {
    const hop = ['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailers','transfer-encoding','upgrade'];
    if (!hop.includes(k.toLowerCase())) resHeaders.set(k, v);
  });

  // Stream back body as-is
  const body = upstreamRes.body;
  return new Response(body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: resHeaders
  });
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1) If request is for our MPD proxy entry -> fetch original MPD, rewrite URLs to proxy, return MPD
  if (url.pathname === PROXY_MPD_PATH) {
    const originalUrl = url.searchParams.get('url');
    if (!originalUrl) {
      event.respondWith(new Response('Missing url param', { status: 400 }));
      return;
    }

    // Ensure target host looks like Sooka
    try {
      const parsed = new URL(originalUrl);
      if (!allowedOrigin(parsed.hostname)) {
        event.respondWith(new Response('Host not allowed', { status: 403 }));
        return;
      }
    } catch (e) {
      event.respondWith(new Response('Bad url', { status: 400 }));
      return;
    }

    event.respondWith((async () => {
      // Fetch MPD upstream with auth
      const upstream = await forwardFetchWithAuth(originalUrl, event.request);
      if (!upstream.ok) {
        return upstream; // return upstream error (status)
      }

      const mpdText = await upstream.text();

      // rewrite absolute http(s) URLs to our proxy endpoint
      // conservative replacement for http(s)://... patterns
      const proxyBase = `${location.origin}${PROXY_GENERIC}?url=`;
      const rewritten = mpdText.replace(/(https?:\/\/[^\s"'<>]+)/g, (m) => {
        return proxyBase + encodeURIComponent(m);
      });

      const headers = new Headers(upstream.headers || {});
      headers.set('Content-Type', 'application/dash+xml; charset=utf-8');
      headers.set('Cache-Control', 'no-store');

      return new Response(rewritten, { status: 200, headers });
    })());
    return;
  }

  // 2) If request is for any of our proxy generic path -> forward upstream with auth and stream
  if (url.pathname === PROXY_GENERIC) {
    const target = url.searchParams.get('url');
    if (!target) {
      event.respondWith(new Response('Missing url param', { status: 400 }));
      return;
    }
    // validate target host
    try {
      const parsed = new URL(target);
      if (!allowedOrigin(parsed.hostname)) {
        event.respondWith(new Response('Host not allowed', { status: 403 }));
        return;
      }
    } catch (e) {
      event.respondWith(new Response('Bad url', { status: 400 }));
      return;
    }

    event.respondWith((async () => {
      return forwardFetchWithAuth(target, event.request);
    })());

    return;
  }

  // else: don't intercept — let default
});

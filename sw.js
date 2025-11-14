// =========================================
// SERVICE WORKER — GENERIC TEMPLATE
// =========================================

importScripts('/config.js'); // Token combined di sini

// Domain stream yang perlu intercept
const TARGET_HOST = "sooka.my"; 
// Contoh: dp.sooka.my → tapi ini placeholder sahaja.

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Hanya intercept domain target
    if (!url.hostname.includes(TARGET_HOST)) return;

    // Header baru
    const headers = new Headers(event.request.headers);

    // Inject token (optional)
    if (self.SOOKA_TOKEN) {
        headers.set("Authorization", "Bearer " + self.SOOKA_TOKEN);
    }

    const newReq = new Request(event.request, {
        headers,
        mode: "cors",
        credentials: "omit"
    });

    event.respondWith(fetch(newReq));
});

// Centralized API base handling
// Uses VITE_API_BASE if set, otherwise falls back to same-origin for browser
// and localhost:8080 for dev when running via Vite.

const DEFAULT_LOCAL_API = 'http://localhost:8080';

export function getApiBase() {
  const envBase = import.meta.env.VITE_API_BASE?.trim();
  if (envBase) return envBase.replace(/\/$/, '');
  // If window location port matches Vite dev and same-origin calls are used with a separate API
  // we assume local API on 8080.
  if (typeof window !== 'undefined' && window.location && window.location.port.startsWith('517')) {
    return DEFAULT_LOCAL_API;
  }
  return '';// same-origin (production) fallback
}

export async function apiFetch(path, options = {}) {
  const base = getApiBase();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : '/' + path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    let body;
    try { body = await res.json(); } catch { body = await res.text(); }
    const error = new Error(`Request failed ${res.status} ${res.statusText}`);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export default { apiFetch, getApiBase };

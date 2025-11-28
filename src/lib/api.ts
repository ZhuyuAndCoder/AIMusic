export async function apiGet<T>(path: string, params?: Record<string, string | number | boolean>) {
  const url = new URL(path, typeof window === 'undefined' ? 'http://localhost' : window.location.origin)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  const json = await res.json()
  return json as { data: T }
}

export async function apiPost<T>(path: string, body?: any) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  const json = await res.json()
  return json as { data: T }
}


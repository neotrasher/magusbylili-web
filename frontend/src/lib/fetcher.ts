const API = import.meta.env.VITE_API_URL as string

export async function http(path: string, init?: RequestInit) {
  const r = await fetch(API + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) },
    ...init,
  })
  if (!r.ok) throw new Error((await r.text()) || r.statusText)
  return r.json()
}
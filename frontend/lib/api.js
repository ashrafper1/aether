export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store"
  });
  if (!res.ok) {
    const msg = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(msg.message || `HTTP ${res.status}`);
  }
  return res.json();
}

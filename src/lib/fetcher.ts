// Tiny typed fetch wrapper for the standard { data } | { error } envelope.

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || "error" in json) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }
  return json.data as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || "error" in json) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }
  return json.data as T;
}

// Thin wrapper around the Frappe/ERPNext REST API (session-cookie auth).

export class FrappeError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (typeof b.message === "string") return b.message;
    if (typeof b.exception === "string") return b.exception;
    if (typeof b._error_message === "string") return b._error_message;
  }
  return fallback;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    ...init,
    headers: { Accept: "application/json", ...(init.headers ?? {}) },
  });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok) {
    throw new FrappeError(extractMessage(body, res.statusText || "Request failed"), res.status);
  }
  return body as T;
}

export interface ListParams {
  fields: string[];
  filters?: unknown[];
  orFilters?: unknown[];
  orderBy?: string;
  limit?: number;
  start?: number;
}

export async function getList<T = Record<string, unknown>>(
  doctype: string,
  p: ListParams,
): Promise<T[]> {
  const q = new URLSearchParams();
  q.set("fields", JSON.stringify(p.fields));
  if (p.filters?.length) q.set("filters", JSON.stringify(p.filters));
  if (p.orFilters?.length) q.set("or_filters", JSON.stringify(p.orFilters));
  q.set("order_by", p.orderBy ?? "modified desc");
  q.set("limit_page_length", String(p.limit ?? 20));
  q.set("limit_start", String(p.start ?? 0));
  const r = await request<{ data: T[] }>(`/api/resource/${encodeURIComponent(doctype)}?${q}`);
  return r.data;
}

export async function getDoc<T = Record<string, unknown>>(
  doctype: string,
  name: string,
): Promise<T> {
  const r = await request<{ data: T }>(
    `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
  );
  return r.data;
}

export async function getCount(doctype: string, filters?: unknown[]): Promise<number> {
  const q = new URLSearchParams({ doctype });
  if (filters?.length) q.set("filters", JSON.stringify(filters));
  const r = await request<{ message: number }>(`/api/method/frappe.client.get_count?${q}`);
  return r.message;
}

/** Call any whitelisted method, e.g. a custom `myapp.api.get_dashboard`. */
export async function callMethod<T = unknown>(
  method: string,
  args?: Record<string, unknown>,
): Promise<T> {
  const q = new URLSearchParams();
  Object.entries(args ?? {}).forEach(([k, v]) =>
    q.set(k, typeof v === "string" ? v : JSON.stringify(v)),
  );
  const r = await request<{ message: T }>(`/api/method/${method}?${q}`);
  return r.message;
}

export async function login(usr: string, pwd: string): Promise<void> {
  await request("/api/method/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usr, pwd }),
  });
}

export async function logout(): Promise<void> {
  await request("/api/method/logout");
}

/** Returns the logged-in user id (e.g. "Administrator"), or throws 401/403 if not logged in. */
export async function getLoggedUser(): Promise<string> {
  const r = await request<{ message: string }>("/api/method/frappe.auth.get_logged_user");
  return r.message;
}

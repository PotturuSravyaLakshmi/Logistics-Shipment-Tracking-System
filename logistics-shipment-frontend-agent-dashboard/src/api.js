
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8001"
).replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem("shipment_access_token");
}

export function saveToken(token) {
  localStorage.setItem("shipment_access_token", token);
}

export function clearToken() {
  localStorage.removeItem("shipment_access_token");
}

export async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      `Cannot connect to API at ${API_BASE}. Start FastAPI and check .env.`
    );
  }

  const raw = await response.text();
  let data = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  if (!response.ok) {
    const detail =
      data && typeof data === "object" ? data.detail : null;

    throw new Error(
      Array.isArray(detail)
        ? detail.map((x) => x.msg || JSON.stringify(x)).join(", ")
        : detail || `Request failed (${response.status})`
    );
  }

  return data;
}

export const endpoints = {
  register: (body) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => apiRequest("/auth/me"),

  shipments: () => apiRequest("/shipments"),

  createShipment: (body) =>
    apiRequest("/shipments", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  createEvent: (shipmentId, body) =>
    apiRequest(`/shipments/${shipmentId}/events`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  shipmentEvents: (shipmentId) =>
    apiRequest(`/shipments/${shipmentId}/events`),

  tracking: (code) =>
    apiRequest(`/tracking/${encodeURIComponent(code.trim())}`),

  
  // Admin dashboard endpoints
  adminStats: () => apiRequest("/admin/stats"),

  adminUsers: () => apiRequest("/admin/users"),

  updateUserRole: (userId, role) =>
    apiRequest(`/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  deactivateAgent: (userId) =>
    apiRequest(`/admin/users/${userId}/deactivate`, {
      method: "PATCH",
    }),

  hubs: () => apiRequest("/hubs"),

  createHub: (data) =>
    apiRequest("/hubs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include", // sends the auth cookie
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error("Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

// Turns an API error into a list of messages we can show on screen
export function errorMessages(err) {
  const data = err.data;
  if (Array.isArray(data)) return data;
  if (data?.errors) return Object.values(data.errors).flat();
  if (err.status === 403) return ["You do not have permission to do that."];
  return ["Something went wrong. Please try again."];
}

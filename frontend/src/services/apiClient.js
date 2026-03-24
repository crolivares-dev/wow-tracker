// ============================================================
// apiClient.js — Cliente HTTP base para comunicación con el backend.
// Centraliza la URL base, headers y manejo de errores.
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Wrapper sobre fetch que maneja errores HTTP de forma uniforme.
 * @param {string} path      - ruta relativa, ej: "/characters"
 * @param {object} [options] - opciones fetch estándar
 * @returns {Promise<any>}
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      // Aquí irá el token de auth cuando se implemente:
      // "Authorization": `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // 204 No Content no tiene body
  if (response.status === 204) return null;

  return response.json();
}

export const apiClient = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: "DELETE" }),
};

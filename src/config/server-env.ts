import "server-only";

const apiBackendUrl = process.env.API_BACKEND_URL;

if (!apiBackendUrl) {
  throw new Error("API_BACKEND_URL environment variable is required");
}

/**
 * NestJS origin for server-side route handlers (never exposed to the client).
 */
export const API_BACKEND_URL = apiBackendUrl.replace(/\/$/, "");

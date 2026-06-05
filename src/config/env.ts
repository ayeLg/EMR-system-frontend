/**
 * Browser API base — must be same-origin `/api` so httpOnly cookies are sent.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

/**
 * NestJS origin for server-side route handlers (never exposed to the client).
 */
export const API_BACKEND_URL =
  process.env.API_BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

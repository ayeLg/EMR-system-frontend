import axios, { AxiosError } from "axios";
import { ENV } from "@/config/env";
import { isApiSuccess, type ApiErrorBody, type PaginationMeta } from "./types";

// Surface pagination meta on the axios response for callers that need it.
declare module "axios" {
  export interface AxiosResponse {
    meta?: PaginationMeta;
  }
}

/**
 * Central HTTP client. In the UI-only phase requests are intercepted by MSW.
 * Swapping to the real NestJS backend = change baseURL / token source only.
 */
export const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

// Request: attach auth token (mock for now).
apiClient.interceptors.request.use((config) => {
  const token = ENV.mockAuthToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiError {
  status: number;
  message: string;
}

// Response: unwrap the standard `{ success, data, meta }` envelope so callers
// receive the payload directly. Non-enveloped responses pass through unchanged.
apiClient.interceptors.response.use(
  (response) => {
    const body: unknown = response.data;
    if (isApiSuccess(body)) {
      response.data = body.data;
      response.meta = body.meta;
    }
    return response;
  },
  // Errors: normalize the backend error envelope into a predictable shape.
  (error: AxiosError<ApiErrorBody>) => {
    const body = error.response?.data;
    const rawMessage = body?.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(", ")
      : (rawMessage ?? error.message ?? "Unexpected error");

    const normalized: ApiError = {
      status: error.response?.status ?? 0,
      message,
    };
    return Promise.reject(normalized);
  },
);

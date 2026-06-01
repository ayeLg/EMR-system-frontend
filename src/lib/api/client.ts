import axios, { AxiosError } from "axios";

/**
 * Central HTTP client. In the UI-only phase requests are intercepted by MSW.
 * Swapping to the real NestJS backend = change baseURL / token source only.
 */
export const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Request: attach auth token (mock for now).
apiClient.interceptors.request.use((config) => {
  const token = "mock-token";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiError {
  status: number;
  message: string;
}

// Response: normalize errors into a predictable shape.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const normalized: ApiError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ??
        error.message ??
        "Unexpected error",
    };
    return Promise.reject(normalized);
  },
);

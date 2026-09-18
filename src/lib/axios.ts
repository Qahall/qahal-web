import axios, { AxiosError } from "axios";
import { supabase } from "./supabase";

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>; // validación opcional
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    let normalized: ApiError = {
      message: error.message ?? "ERROR DESCONOCIDO",
      statusCode: error.response?.status ?? 500,
      errors: undefined,
    };

    if (error.response?.data) {
      normalized = {
        message: error.response.data.message ?? "Error inesperado",
        statusCode: error.response.status ?? 500,
        errors: error.response.data.errors,
      };
    }

    return Promise.reject(normalized);
  }
);

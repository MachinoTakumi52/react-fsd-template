import axios from "axios";
import { toApiError } from "./api-error";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT_MS = 10_000;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  // CSRFトークンなど、Cookie認証で共通する送信処理を追加するための拡張点。
  (config) => config,
  (error: unknown) => Promise.reject(toApiError(error)),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);

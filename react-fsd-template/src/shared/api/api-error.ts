import axios from "axios";

type ApiErrorOptions = {
  status?: number;
  code?: string;
  data?: unknown;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly data?: unknown;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.data = options.data;
  }
}

// Axios固有のエラーを、アプリケーション全体で扱える共通エラーへ変換する。
export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return new ApiError(error.message, {
      status: error.response?.status,
      code: error.code,
      data: error.response?.data,
      cause: error,
    });
  }

  return new ApiError("Unexpected API error.", { cause: error });
};

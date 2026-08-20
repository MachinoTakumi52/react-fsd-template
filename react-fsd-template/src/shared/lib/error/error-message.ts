import { ApiError } from "@shared/api";

export const ERROR_MESSAGES = {
  badRequest: "入力内容を確認してください。",
  unauthorized: "セッションの有効期限が切れました。再度ログインしてください。",
  forbidden: "この操作を実行する権限がありません。",
  notFound: "対象のデータが見つかりませんでした。",
  conflict: "データが更新されています。最新の状態を確認してください。",
  validation: "入力内容を確認してください。",
  timeout: "通信がタイムアウトしました。しばらくしてから再度お試しください。",
  rateLimit: "リクエストが集中しています。しばらくしてから再度お試しください。",
  network: "サーバーに接続できません。通信環境を確認してください。",
  server: "サーバーでエラーが発生しました。しばらくしてから再度お試しください。",
  unexpected: "予期しないエラーが発生しました。",
} as const;

// HTTPステータスやAxiosのエラーコードを、画面へ表示する共通メッセージに変換する。
export const getErrorMessage = (error: unknown): string => {
  if (!(error instanceof ApiError)) {
    return ERROR_MESSAGES.unexpected;
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return ERROR_MESSAGES.timeout;
  }

  if (error.status === undefined) {
    return ERROR_MESSAGES.network;
  }

  if (error.status >= 500) {
    return ERROR_MESSAGES.server;
  }

  const statusMessages: Partial<Record<number, string>> = {
    400: ERROR_MESSAGES.badRequest,
    401: ERROR_MESSAGES.unauthorized,
    403: ERROR_MESSAGES.forbidden,
    404: ERROR_MESSAGES.notFound,
    408: ERROR_MESSAGES.timeout,
    429: ERROR_MESSAGES.rateLimit,
    409: ERROR_MESSAGES.conflict,
    422: ERROR_MESSAGES.validation,
  };

  return statusMessages[error.status] ?? ERROR_MESSAGES.unexpected;
};

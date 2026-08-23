import { apiClient } from "@shared/api";

export const LOGIN_API_PATH = "/auth/login";

/** ログインAPIへ送信するリクエスト */
export type LoginRequest = {
  email: string;
  password: string;
};

/** ログインAPIから受け取るレスポンス */
export type LoginResponse = {
  id: string;
  name: string;
};

/** メールアドレスとパスワードを使用してログインする */
export const login = async (input: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(LOGIN_API_PATH, input);

  return response.data;
};

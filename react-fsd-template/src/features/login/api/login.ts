import { apiClient } from "@shared/api";

/** ログインAPIへ送信するリクエスト */
type LoginRequest = {
  email: string;
  password: string;
};

/** ログインAPIから受け取るレスポンス */
type LoginResponse = {
  id: string;
  name: string;
};

/** メールアドレスとパスワードを使用してログインする */
export const login = async (input: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", input);

  return response.data;
};

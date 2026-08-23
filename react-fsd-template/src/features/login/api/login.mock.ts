import type AxiosMockAdapter from "axios-mock-adapter";
import { LOGIN_API_PATH, type LoginRequest, type LoginResponse } from "./login";
const MOCK_LOGIN_USER: LoginResponse = {
  id: "mock-user-1",
  name: "モックユーザー",
};

/** ログインAPIの開発用モックを登録する */
export const registerLoginMock = (mock: AxiosMockAdapter) => {
  mock.onPost(LOGIN_API_PATH).reply((config) => {
    const input = JSON.parse(config.data as string) as LoginRequest;

    if (input.email === "user@example.com" && input.password === "password") {
      return [200, MOCK_LOGIN_USER];
    }

    return [401, { error: "メールアドレスまたはパスワードが正しくありません。" }];
  });
};

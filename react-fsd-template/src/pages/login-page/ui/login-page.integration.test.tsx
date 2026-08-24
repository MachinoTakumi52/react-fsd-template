import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { registerLoginMock } from "@features/login/api/login.mock";
import { ERROR_MESSAGES } from "@shared/lib/error";
import { apiClient } from "@shared/api";
import { ErrorNotificationProvider } from "@shared/ui";
import { LoginPage } from "./login-page";

describe("LoginPage", () => {
  let mock: AxiosMockAdapter;

  beforeEach(() => {
    mock = new AxiosMockAdapter(apiClient);
    registerLoginMock(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  const renderLoginPage = () =>
    render(
      <ErrorNotificationProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </ErrorNotificationProvider>,
    );

  it("不正なメールアドレスでは送信できない", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("メールアドレス"), "invalid-email");
    await user.type(screen.getByLabelText("パスワード"), "password");

    expect(screen.getByText("正しいメールアドレスを入力してください。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeDisabled();
  });

  it("正しい認証情報でログイン結果を表示する", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("メールアドレス"), "user@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(await screen.findByText("モックユーザーさんとしてログインしました。")).toBeInTheDocument();
  });

  it("認証に失敗すると共通エラーを表示する", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("メールアドレス"), "other@example.com");
    await user.type(screen.getByLabelText("パスワード"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(await screen.findByText(ERROR_MESSAGES.unauthorized)).toBeInTheDocument();
  });
});

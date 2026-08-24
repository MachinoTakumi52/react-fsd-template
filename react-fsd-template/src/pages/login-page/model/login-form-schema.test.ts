import { describe, expect, it } from "vitest";
import { loginFormSchema } from "./login-form-schema";

describe("loginFormSchema", () => {
  it("正しいメールアドレスとパスワードを受け入れる", () => {
    const result = loginFormSchema.safeParse({
      email: "user@example.com",
      password: "password",
    });

    expect(result.success).toBe(true);
  });

  it("不正なメールアドレスを拒否する", () => {
    const result = loginFormSchema.safeParse({
      email: "invalid-email",
      password: "password",
    });

    expect(result.success).toBe(false);
  });
});

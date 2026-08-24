import { describe, expect, it } from "vitest";
import { ApiError } from "@shared/api";
import { ERROR_MESSAGES, getErrorMessage } from "./error-message";

describe("getErrorMessage", () => {
  it("401では再ログインを促す", () => {
    expect(getErrorMessage(new ApiError("Unauthorized", { status: 401 }))).toBe(ERROR_MESSAGES.unauthorized);
  });

  it("タイムアウトコードでは再試行を促す", () => {
    expect(getErrorMessage(new ApiError("Timeout", { code: "ECONNABORTED" }))).toBe(ERROR_MESSAGES.timeout);
  });

  it("ApiError以外では予期しないエラーとして扱う", () => {
    expect(getErrorMessage(new Error("Unknown"))).toBe(ERROR_MESSAGES.unexpected);
  });
});

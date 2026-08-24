import { expect, test } from "@playwright/test";

test("ホーム画面からログインできる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("メールアドレス").fill("user@example.com");
  await page.getByLabel("パスワード").fill("password");
  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page.getByText("モックユーザーさんとしてログインしました。")).toBeVisible();
});
